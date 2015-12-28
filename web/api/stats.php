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
        $return = $database->query("SELECT SUM(players) AS player_total, SUM(slots) AS slot_total FROM server_details;")->fetchAll()[0];
        $response['data'] = array('players' => $return['player_total'], 'slots' => $return['slot_total']);

        echo json_encode($response);
        break;
    case "TotalServers":
        $return = $database->query("SELECT COUNT(*) AS server_total FROM server_details;")->fetchAll()[0];
        $response['data'] = array('servers' => $return['server_total']);

        echo json_encode($response);
        break;
    default:
        $response['error'] = true;
        $response['message'] = "Unrecognized endpoint";
        break;
}

 ?>
