<?php 

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

$users_list = json_decode($_POST['list-area'], true);

$fpc = count($users_list) * .1;

$error = rand(0, $fpc);

//sleep(rand(5, 10));

echo json_encode(['success' => count($users_list) - $error, 'error' => $error]);