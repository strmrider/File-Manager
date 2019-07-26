<?php
include "files_database.php";
include "accounts_database.php";

$ini = parse_ini_file("../config.ini");
$password = $ini["db_password"];
if(!$password)
    $password = "";
$accounts = new AccountsDatabase($ini["db_server"], $ini["db_username"], 
                                $password, $ini["db_name"], null);
$files = new FilesDatabase($ini["db_server"], $ini["db_username"], 
                            $password, $ini["db_name"], null);
$accountsResult = $accounts->initTable();
$filesResult = $files->initTable();

if($accountsResult && $filesResult)
    echo "Database was successfuly initialized";
else 
    echo "Database initialization failed";
?>