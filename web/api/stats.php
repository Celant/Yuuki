<?php

require '../../vendor/autoload.php';
require '../../secrets.php';

header('Content-Type: application/json');

$response = array('error' => false, 'message' => "");
$cachefiles = [
    "players.cache",
    "slots.cache",
    "servers.cache"
];
$action = $_GET['action'];

try {
	$database = new medoo([
		'database_type' => 'mysql',
		'database_name' => $dbname,
		'server' => $dbhost,
		'username' => $dbuser,
		'password' => $dbpass,
		'port' => $dbport,
		'charset' => 'utf8'
	]);
} catch (Exception $e) {
	die("Failed to connect to the database\r\n");
}

foreach ($cachefiles as $cachefile) {
    if (!file_exists($cachefile)) {
        touch($cachefile);
    }
}

if (empty($action)) {
    $response['error'] = true;
    $response['message'] = "Missing parameters";
    echo json_encode($response);
}

switch ($action) {
    case "CurrentPlayers":
        $return = $database->query("SELECT SUM(players) AS player_total, SUM(slots) AS slot_total FROM server_details")->fetchAll()[0];
        $response['data'] = array('players' => $return['player_total'], 'slots' => $return['slot_total']);

        echo json_encode($response);
        break;
    case "TotalServers":
        $return = $database->query("SELECT COUNT(*) AS server_total FROM server_details;")->fetchAll()[0];
        $response['data'] = array('servers' => $return['server_total']);

        echo json_encode($response);
        break;
    case "History":
        $return = $database->query("SELECT * FROM archive WHERE timestamp > DATE_SUB(NOW(), INTERVAL 48 HOUR);")->fetchAll();
        $chartData = [];
        foreach ($return as $data) {
            $record["players"] = $data["currentplayers"];
            $record["slots"] = $data["currentslots"];
            $record["servers"] = $data["currentservers"];
            $record["timestamp"] = $data["timestamp"];
            $chartData[] = $record;
        }
        $response['data'] = array('history' => $chartData);

        echo json_encode($response);
        break;
    case "Providers":
        $return = $database->query("SELECT * FROM hosting_providers;")->fetchAll();
        $providerData = [];
        foreach ($return as $data) {
            $servers = $database->query("SELECT COUNT(*) FROM server WHERE providertoken='{$data['providertoken']}';");
            $serverData["providertoken"] = $data["providertoken"];
            $serverData["providername"] = $data["providername"];
            $serverData["official"] = $data["official"];
            $serverData["servers"] = $servers;
            $providerData[] = $serverData;
        }
        $response['data'] = array('providers' => $providerData);

        echo json_encode($response);
        break;
    default:
        $response['error'] = true;
        $response['message'] = "Unrecognized endpoint";
        break;
}

 ?>
