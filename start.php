<?php
require __DIR__ . '/vendor/autoload.php';
require __DIR__ . 'secrets.php';

echo 'Connecting to Database';
$database = new medoo([
    'database_type' => 'mysql',
    'database_name' => 'name',
    'server' => 'localhost',
    'username' => $DBUsername,
    'password' => $DBPassword,
    'charset' => 'utf8'
]);


?>