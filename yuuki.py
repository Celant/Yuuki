from flask import Flask, render_template, Response

from influxdb import InfluxDBClient

import urlparse, hashlib, json

app = Flask(__name__)

client = InfluxDBClient('127.0.0.1', 8086, 'root', 'root', 'tshock')

query_cur_players = 'SELECT sum("cur_players") FROM (SELECT last("cur_players") AS "cur_players" FROM server_stats GROUP BY "server") WHERE time > now() - 2m'
query_max_players = 'SELECT sum("max_players") FROM (SELECT last("max_players") AS "max_players" FROM server_stats GROUP BY "server") WHERE time > now() - 2m'

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
            server.provider = self.get_object(data['providerId'])
        else:
            server.provider = None
    else:
        m = hashlib.md5()
        m.update(self.get_client_ip(request) + ":" + str(data['port']))
        
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

    client.write_points(json_body)

    stats = type('', (), {})()
    
    stats.server = server.fingerprint
    stats.cur_players = data['currentPlayers']
    stats.max_players = data['maxPlayers']
    stats.memory = data['systemRam']

    json_body = [
        {
            "measurement": "server_stats",
            "tags": {
                "server": stats.server
            },
            "fields": {
                "cur_players": stats.cur_players,
                "max_players": stats.max_players,
                "memory": stats.memory,
            }
        }
    ]
    
    client.write_points(json_body)

    return json.dumps( {'success': True} )

@app.route('/api/stats/currentplayers')
def cur_players():
    response = {'error': False, 'message': ''}
    result = client.query(query_cur_players)
    generator = result.get_points()

    try:
        stat = next(generator)
    except StopIteration:
        response['cur_players'] = 0
    else:
        response['cur_players'] = stat['sum']

    result = client.query(query_max_players)
    generator = result.get_points()

    try:
        stat = next(generator)
    except StopIteration:
        response['max_players'] = 0
    else:
        response['max_players'] = stat['sum']


    return Response(json.dumps(response), mimetype='application/json')
