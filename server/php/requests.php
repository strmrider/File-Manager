<?php
include "request_handler.php";
include "account_handler.php";

$ini = parse_ini_file('config.ini');
$handler;
if((int)$_POST["request"] >= 200 ) 
    $handler = new AccountHandler($ini);
else 
    $handler = new RequestHandler($ini);
    
$result = $handler->handle();
if ($result)
    echo $result;
else
    echo "-1";
?>