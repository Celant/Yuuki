<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/secrets.php';
require __DIR__ . '/nginx.php';

// Can be nginx or apache

$tables = [
	'server' => "CREATE TABLE server(
		id MEDIUMINT NOT NULL AUTO_INCREMENT,
		address CHAR(15), port INT NOT NULL,
		lastupdate BIGINT NOT NULL,
		PRIMARY KEY (id)
		) ENGINE=InnoDB;",
	'server_settings' => "CREATE TABLE `server_settings` (
		`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
		`serverid` MEDIUMINT NOT NULL,
		`lastupdate` BIGINT NOT NULL,
		PRIMARY KEY (`id`),
		CONSTRAINT `FK_SERVER_ID_SETTINGS` FOREIGN KEY (`serverid`) REFERENCES `server` (`id`)
			ON DELETE CASCADE
			ON UPDATE CASCADE
		) ENGINE=InnoDB;",
	'server_details' => "CREATE TABLE `server_details`(
		`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
		`serverid` MEDIUMINT NOT NULL,
		`players` INT,
		`port` INT NOT NULL,
		`slots` INT,
		PRIMARY KEY (`id`),
		CONSTRAINT `FK_SERVER_ID_DETAILS` FOREIGN KEY (`serverid`) REFERENCES `server` (`id`)
			ON DELETE CASCADE
			ON UPDATE CASCADE
		) ENGINE=InnoDB;",
];

echo "Connecting to Database\r\n";
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

echo "Connection succesful\r\n";
echo "Checking if required tables exist\r\n";

foreach($tables as $key => $value) {
	$result = $database->query("SHOW TABLES LIKE '".$key."'")->fetchAll();
	if(empty($result)) {
		echo "Creating missing table '" . $key . "'\r\n";
		$database->query($value);
	}
}

echo "All tables present and accounted for!\r\n";
echo "Installation complete!\r\n";

?>
