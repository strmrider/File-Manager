<?php
include_once "query_builder/accounts_db_query_builder.php";

class AccountsDatabase
{
    private $connection;
    private $queryBuilder;

    function __construct($server, $username, $password, $dbName)
    {
        $this->connection = new mysqli(
            $server, $username, $password, $dbName);

        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }

        $this->queryBuilder = new AccountsDbQueryBuilder("users");
    }

    function __destruct() {
        $this->close();
    }

    public function close()
    {
        mysqli_close($this->connection);
    }
    
    public function initTable()
    {
        $drop = $this->connection->query($this->queryBuilder->dropTable());
        if($drop)
            return $this->createTable();
        else return false;
    }

    public function createTable()
    {
        return $this->connection->query(
            $this->queryBuilder->newTable());
    }

    public function getAuthenticationKey($username)
    {
        return $username.(rand(2, 1000) * rand(1000,2000));
    }


    public function setUserData($record, $authKey)
    {
        $userData = array("username"=>$record["username"], 
                    "creation_date"=>$record["creation_date"], 
                    "last_login"=>$record["last_login"], 
                    "email"=>$record["email"],
                    "authKey"=>$authKey);

        return $userData;
    }

    public function selectUser($user)
    {
        $rows =  $this->connection->query(
            $this->queryBuilder->selectUser($user));
        if ($rows && $rows->num_rows > 0)
        {
            $authKey = $this->getAuthenticationKey($user);
            $this->updateAuthKey($user, $authKey);
            return $this->setUserData($rows->fetch_assoc(), $authKey);
        }
        else return null;
    }

    public function verifyLogin($user, $password)
    {
        $rows =  $this->connection->query(
            $this->queryBuilder->selectUser($user));
        if ($rows && $rows->num_rows > 0)
        {
            $authKey = $this->getAuthenticationKey($user);
            $this->updateAuthKey($user, $authKey);
            $record = $rows->fetch_assoc();
            if (password_verify($password, $record["password"]))
                return $this->setUserData($record, $authKey);
        }
   
        return null;
    }

    public function verifyAuthKey($username, $authKey)
    {
        $rows =  $this->connection->query(
            $this->queryBuilder->selectAuthKey($username));
        if ($rows && $rows->num_rows > 0){
            $key = $rows->fetch_assoc()["authentication_key"];
            if (password_verify($authKey, $key))
                return true;
            else false;
        }
    }

    public function newAccount($args)
    {
        return $this->connection->query(
            $this->queryBuilder->newAccount($args));
    }

    public function deleteUser($user)
    {
        return $this->connection->query(
            $this->queryBuilder->removeUser($user));
    }

    public function updateLoginDate($user, $date)
    {
        return $this->connection->query(
            $this->queryBuilder->updateLoginDate($user, $date));
    }

    public function updateAuthKey($username, $authKey)
    {
        return $this->connection->query(
            $this->queryBuilder->updateAuthKey($username, $authKey));
    }
}

?>