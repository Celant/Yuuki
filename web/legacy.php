<?php
require '../vendor/autoload.php';
require '../secrets.php';

$data = json_decode(urldecode($_GET['data']), true);
$data['address'] = $_SERVER['REMOTE_ADDR'];
$output = array();
$hash = md5($data['address'] . ":" . $data['port']);
$disableDB = false;

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
	    "id" => $hash
	]);

	if(empty($record)) {
	    $database->insert("server", [
	        "id" => $hash,
	        "address" => $data['address'],
	        "port" => $data['port'],
	        "lastupdate" => time(),
	    ]);
	    $database->insert("server_details", [
	        "serverid" => $hash,
	        "players" => $data['currentPlayers'],
	        "slots" => $data['maxPlayers'],
            "memory" => $data['systemRam']
	    ]);
	} else {
	    $database->update("server", [
	        "id" => $hash,
	        "address" => $data['address'],
	        "port" => $data['port'],
	        "lastupdate" => time(),
	    ], [
	        "id" => $hash
	    ]);
	    $database->update("server_details", [
	        "serverid" => $hash,
	        "players" => $data['currentPlayers'],
	        "slots" => $data['maxPlayers'],
            "memory" => $data['systemRam']
	    ], [
	        "serverid" => $hash
	    ]);
	}
}

$output["success"] = "Ok";

echo json_encode($output);

?>
