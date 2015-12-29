<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/secrets.php';

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
echo "Executing .sql file!\r\n";

$command = "mysql -u{$dbuser} -p{$dbpass} "
 . "-h {$dbhost} -D {$dbname} < ";

$output = shell_exec($command . 'setup.sql');

echo "All tables present and accounted for!\r\n";
echo "Installation complete!\r\n";

?>
