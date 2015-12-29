<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/secrets.php';

$tables = [
	'server' => "CREATE TABLE server(
		`id` VARCHAR(36) NOT NULL,
		`address` CHAR(45),
		`port` INT NOT NULL,
		`providertoken` VARCHAR(36),
		`notlegacy` TINYINT(1) DEFAULT 0,
		`lastupdate` BIGINT NOT NULL,
		PRIMARY KEY (id)
		) ENGINE=InnoDB;",
	'server_settings' => "CREATE TABLE `server_settings` (
		`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
		`serverid` VARCHAR(50) NOT NULL,
		PRIMARY KEY (`id`),
		CONSTRAINT `FK_SERVER_ID_SETTINGS` FOREIGN KEY (`serverid`) REFERENCES `server` (`id`)
			ON DELETE CASCADE
			ON UPDATE CASCADE
		) ENGINE=InnoDB;",
	'server_details' => "CREATE TABLE `server_details`(
		`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
		`serverid` VARCHAR(50) NOT NULL,
		`players` INT,
		`slots` INT,
		`memory` BIGINT,
		PRIMARY KEY (`id`),
		CONSTRAINT `FK_SERVER_ID_DETAILS` FOREIGN KEY (`serverid`) REFERENCES `server` (`id`)
			ON DELETE CASCADE
			ON UPDATE CASCADE
		) ENGINE=InnoDB;",
	'server_providers' => "CREATE TABLE `server_details`(
		`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
		`providertoken` VARCHAR(36) NOT NULL,
		`providername` VARCHAR(40) NOT NULL,
		`official` TINYINT(1) DEFAULT 0,
		PRIMARY KEY (`id`)
		) ENGINE=InnoDB;",
];

$events = [
	'timeout' => "CREATE EVENT timeout_server
			ON SCHEDULE EVERY 1 MINUTE
			DO DELETE FROM server WHERE lastupdate < UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL 6 MINUTE));"
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

foreach($events as $key => $value) {
	$result = $database->query("SHOW EVENTS LIKE '".$key."'")->fetchAll();
	if(empty($result)) {
		echo "Creating missing event '" . $key . "'\r\n";
		$database->query($value);
	}
}

echo "All tables present and accounted for!\r\n";
echo "Installation complete!\r\n";

?>
