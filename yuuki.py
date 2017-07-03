from flask import Flask, render_template, Response, request
from influxdb import InfluxDBClient
from ddtrace import tracer
from ddtrace.contrib.flask import TraceMiddleware

from requests.exceptions import ConnectionError

import os, urlparse, hashlib, json

influx_host = os.environ.get('INFLUX_HOST')
influx_port = os.environ.get('INFLUX_PORT')
influx_user = os.environ.get('INFLUX_USER')
influx_password = os.environ.get('INFLUX_PASSWORD')

app = Flask(__name__)
traced_app = TraceMiddleware(app, tracer, service="rocky-journey-34509-trace")

client = InfluxDBClient(influx_host, influx_port, influx_user, influx_password, 'tshock', timeout=1, retries=1)

query_cur_players = 'SELECT sum("cur_players") FROM (SELECT last("cur_players") AS "cur_players" FROM server_stats GROUP BY "server") WHERE time > now() - 5m'
query_max_players = 'SELECT sum("max_players") FROM (SELECT last("max_players") AS "max_players" FROM server_stats GROUP BY "server") WHERE time > now() - 5m'
query_total_servers = 'SELECT count("port") FROM "server" WHERE time > now() - 5m'
query_occupied_servers = 'SELECT count("cur_players") FROM "server_stats" WHERE "cur_players" > 0 AND time > now() - 5m'
query_historical_players = 'SELECT sum("cur_players") FROM "server_stats" WHERE time > now() - 24h GROUP BY time(5m)'
query_provider_servers = 'SELECT count("port") FROM "server" WHERE "provider" = \'{0}\' AND time > now() - 5m'
query_providerless_servers = 'SELECT count("port") FROM "server" WHERE "provider" = \'\' AND time > now() - 5m'

def influx_query(query):
    result = client.query(query)

    try:
        generator = result.get_points()
    except ConnectionError:
        return None

    return generator

@app.route('/')
def index():
    return render_template('yuuki/index.html')

@app.route('/publish/<encoded>')
@app.route('/submit/<encoded>')
def submit(encoded):
    decoded = urlparse.unquote(encoded)
    data = json.loads(decoded)

    server = type('', (), {})()
    
    if ('serverId' in data):
        server.is_legacy = False
    else:
        server.is_legacy = True
    
    if (not server.is_legacy):
        server.fingerprint = data['serverId']
        server.port = data['port']
        server.tshock_version = data['version']
        server.terraria_version = data['terrariaVersion']
        
        if (data['providerId']):
            server.provider = data['providerId']
        else:
            server.provider = None
    else:
        m = hashlib.md5()

	if request.headers.getlist("X-Forwarded-For"):
            ip = request.headers.getlist("X-Forwarded-For")[0]
        else:
            ip = request.remote_addr

        m.update(ip + ":" + str(data['port']))
        
        server.fingerprint = m.hexdigest()
        server.port = data['port']
        server.provider = None
        server.tshock_version = data['version']
        server.terraria_version = data['terrariaVersion']
    
    json_body = [
        {
            "measurement": "server",
            "tags": {
                "fingerprint": server.fingerprint,
                "provider": server.provider
            },
            "fields": {
                "port": server.port,
                "tshock_version": server.tshock_version,
                "terraria_version": server.terraria_version,
            }
        }
    ]

    try:
        client.write_points(json_body)
    except:
        return json.dumps( {'success': True, 'message': 'Data not submitted to datastore. Cached for next connection.'} )

    stats = type('', (), {})()
    
    stats.server = server.fingerprint
    stats.cur_players = data['currentPlayers']
    stats.max_players = data['maxPlayers']
    stats.memory = data['systemRam']
    
    if 'ignorePluginVersion' in data:
        if (not server.is_legacy):
            stats.ignore_plugin_version = data['ignorePluginVersion']
        else:
            stats.ignore_plugin_version = False
    else:
        stats.ignore_plugin_version = False

    json_body = [
        {
            "measurement": "server_stats",
            "tags": {
                "server": stats.server,
            },
            "fields": {
                "cur_players": stats.cur_players,
                "max_players": stats.max_players,
                "memory": stats.memory,
                "ignore_plugin_version": stats.ignore_plugin_version
            }
        }
    ]

    try:
        client.write_points(json_body)
    except:
        return json.dumps( {'success': True, 'message': 'Data not submitted to datastore. Cached for next connection.'} )
    return json.dumps( {'success': True} )

@app.route('/api/stats/currentplayers')
def cur_players():
    response = {'error': False, 'message': ''}
    generator = influx_query(query_cur_players)

    if generator == None:
        response['error'] = True
        response['message'] = 'Failed to connect to InfluxDB'
        return Response(json.dumps(response), mimetype='application/json')

    try:
        stat = next(generator)
    except StopIteration:
        response['cur_players'] = 0
    else:
        response['cur_players'] = stat['sum']

    generator = influx_query(query_max_players)

    try:
        stat = next(generator)
    except StopIteration:
        response['max_players'] = 0
    else:
        response['max_players'] = stat['sum']


    return Response(json.dumps(response), mimetype='application/json')

@app.route('/api/stats/totalservers')
def total_servers():
    response = {'error': False, 'message': ''}
    generator = influx_query(query_total_servers)

    if generator == None:
        response['error'] = True
        response['message'] = 'Failed to connect to InfluxDB'
        return Response(json.dumps(response), mimetype='application/json')

    try:
        stat = next(generator)
    except StopIteration:
        response['total_servers'] = 0
    else:
        response['total_servers'] = stat['count']

    generator = influx_query(query_occupied_servers)

    try:
        stat = next(generator)
    except StopIteration:
        response['occupied_servers'] = 0
    else:
        response['occupied_servers'] = stat['count']


    return Response(json.dumps(response), mimetype='application/json')

@app.route('/api/stats/history')
def history():
    response = {'error': False, 'message': '', 'history': list()}
    generator = influx_query(query_historical_players)

    if generator == None:
        response['error'] = True
        response['message'] = 'Failed to connect to InfluxDB'
        return Response(json.dumps(response), mimetype='application/json')

    for stat in generator:
        response['history'].append(stat)

    return Response(json.dumps(response), mimetype='application/json')

@app.route('/api/stats/providers')
def providers():
    response = {'error': False, 'message': '', 'providers': list()}

    data_file = os.getenv('PROVIDER_JSON', "[]")
    data = json.loads(data_file)

    for provider in data:
        serverData = {}
        serverData["providername"] = provider["providername"];
        serverData["color"] = provider["color"];
        serverData["highlight"] = provider["highlight"];
        serverData["official"] = provider["official"];

        generator = influx_query(query_provider_servers.format(provider["providertoken"]))

        if generator == None:
            response['error'] = True
            response['message'] = 'Failed to connect to InfluxDB'
            return Response(json.dumps(response), mimetype='application/json')

        try:
            stat = next(generator)
        except StopIteration:
            serverData['servers'] = 0
        else:
            serverData['servers'] = stat['count']

        response['providers'].append(serverData)

    serverData = {}
    serverData["providername"] = 'Other';
    serverData["color"] = '#CCCCCC';
    serverData["highlight"] = '#DDDDDD';
    serverData["official"] = 0;

    generator = influx_query(query_providerless_servers)
    generator = result.get_points()

    try:
        stat = next(generator)
    except StopIteration:
       serverData['servers'] = 0
    else:
       serverData['servers'] = stat['count']

    response['providers'].append(serverData)


    return Response(json.dumps(response), mimetype='application/json')
