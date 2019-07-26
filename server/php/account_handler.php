<?php
include_once "database/accounts_database.php";
include_once "database/files_database.php";
include_once  "enum.php";

class AccountHandler
{
    private $database;
    private $server;
    private $username;
    private $password;
    private $dbName;

    public function __construct($ini)
    {
        $this->server = $ini["db_server"];
        $this->username = $ini["db_username"];
        $this->password = $ini["db_password"];
        $this->dbName = $ini["db_name"];
        
        if(!$this->password)
            $this->password = "";
        $this->database = new AccountsDatabase($this->server, $this->username, 
                        $this->password, $this->dbName);
    }

    private function getFilesDatabaseConnection($username)
    {
        return $database = new FilesDatabase($this->server, $this->username, 
                $this->password, $this->dbName, $username);
    }

    public function verifyAuthKey($username, $authKey)
    {
        return $this->database->verifyAuthKey($username, $authKey);
    }

    private function newAccount()
    {
        $username = $_POST["username"]; 
        if(!$this->database->selectUser($username)){
            $password = password_hash($_POST["password"], PASSWORD_DEFAULT);
            $authKey = $this->database->getAuthenticationKey($username);
            $args = array($username, $password, $_POST["email"], 
                            $_POST["creationDate"], $_POST["loginDate"], $authKey);

            // creates account
            if ($this->database->newAccount($args)){
                $fileDatabase = $this->getFilesDatabaseConnection($username);
                // creates root dir on database
                if($fileDatabase->newAccountRootDir($_POST["username"], $_POST["creationDate"])){
                    mkdir(dirname(dirname(__FILE__)) ."/storage/users/$username/", 0755, true);
                    // selects new account
                    if ($user = $this->database->selectUser($username))
                        return json_encode($user);
                }
            }
        }

        return false;
    }

    /********
    * Logins
    *********/
    private function autologin()
    {
        $user =  $this->database->selectUser($_POST["username"]);
        if ($user)
        {
            $this->database->updateLoginDate($_POST["username"], $_POST["loginDate"]);
            return json_encode($user);
        }
        else return false;
    }

    private function login()
    {
        $user = $this->database->verifyLogin($_POST["username"],$_POST["password"]);
        if ($user)
        {
            $this->database->updateLoginDate($_POST["username"], $_POST["loginDate"]);
            return json_encode($user);
        }
        else return false;
    }

    public function handle()
    {
        $request = $_POST["request"];
        switch($request)
        {
            case REQUEST::$LOGIN:
                return $this->login();
            case REQUEST::$AUTOLOGIN:
                return $this->autologin();
            case REQUEST::$NEW_ACCOUNT:
                return $this->newAccount();
        }
    }
}

?>