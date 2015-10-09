<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/secrets.php';
require __DIR__ . '/nginx.php';

// Can be nginx or apache
$engine = "nginx";
$host = "stats.celant.co.uk";
$nginx_vhosts = "/etc/nginx/sites-enabled/";

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
echo "Generating configuration files for specified http engine\r\n";

if($engine == "nginx") {
	// Generate NGINX vhost config
	$file = __DIR__ . "/web/nginx/" . $host . ".conf";
	$config = GenerateSiteConfig($host, __DIR__ . "/web/nginx/www");
	file_put_contents($file, $config);
	if(file_exists($nginx_vhosts . $host . ".conf")) {
		if(is_link($nginx_vhosts . $host . ".conf")) {
			unlink($nginx_vhosts . $host . ".conf");
		} else {
			die("$file exists but is not a symbolic link\r\n");
		}
	}
	symlink($file, $nginx_vhosts . $host . ".conf");
}
elseif($engine == "apache") {
	die("Apache is not yet supported.");
}

echo "Configs generated\r\n";
echo "Starting up web server\r\n";

if()

?>
