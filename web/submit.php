<?php
require '../vendor/autoload.php';
require '../secrets.php';

$data = json_decode(urldecode($_GET['data']), true);
$data['address'] = $_SERVER['REMOTE_ADDR'];
$output = array();
$disableDB = true;

if(!$disableDB) {

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

	$record = $database->get("server", "id", [
	    "id" => $data['serverId']
	]);

	if(empty($record)) {
	    $database->insert("server", [
	        "id" => $data['serverId'],
	        "address" => $data['address'],
	        "port" => $data['port'],
            "providertoken" => $data['providerId'],
			"notlegacy" => 1,
	        "lastupdate" => time(),
	    ]);
	    $database->insert("server_details", [
	        "serverid" => $data['serverId'],
	        "players" => $data['currentPlayers'],
	        "slots" => $data['maxPlayers'],
            "memory" => $data['systemRam']
	    ]);
	} else {
	    $database->update("server", [
	        "id" => $data['serverId'],
	        "address" => $data['address'],
	        "port" => $data['port'],
            "providertoken" => $data['providerId'],
	        "lastupdate" => time(),
	    ], [
	        "id" => $data['serverId']
	    ]);
	    $database->update("server_details", [
	        "serverid" => $data['serverId'],
	        "players" => $data['currentPlayers'],
	        "slots" => $data['maxPlayers'],
            "memory" => $data['systemRam']
	    ], [
	        "serverid" => $data['serverId']
	    ]);
	}
}

$output["success"] = true;

echo json_encode($output);

?>
