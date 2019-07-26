<?php

class AccountsDbQueryBuilder
{
    private $table="";

    public function __construct($table)
    {
        $this->table = $table;
    }

    private function addApostraphe(&$array)
    {
        for($i=0; $i<count($array); $i++)
        {
            $array[$i] = "'".$array[$i]."'";
        }
        return $array;
    }

    public function newTable()
    {
        return "CREATE TABLE $this->table (
                username varchar(255),
                password varbinary(255),
                email varchar(255),
                creation_date varchar(255),
                last_login varchar(255),
                authentication_key varbinary(255));";
    }

    public function dropTable()
    {
        return "DROP TABLE $this->table;";
    }

    public function selectRecords()
    {
        return "SELECT * FROM $this->table;";
    }

    public function selectUser($username)
    {
        return "SELECT * FROM $this->table WHERE username='$username';";
    }

    public function updateLoginDate($username, $loginDate)
    {
        return "UPDATE $this->table set last_login='$loginDate' 
                WHERE username='$username';";
    }

    public function newAccount($args)
    {
        $args = $this->addApostraphe($args);
        $values = implode(",", $args);
        $keys = "(username, password, email, creation_date, 
        last_login, authentication_key)";
        return "INSERT INTO $this->table $keys VALUES ($values);";
    }

    public function removeUser($username)
    {
        return "DELETE FROM $this->table WHERE username='$this->username';";
    }   

    public function updateAuthKey($username, $authKey)
    {
        $key = password_hash($authKey, PASSWORD_DEFAULT);
        return "UPDATE $this->table set authentication_key='$key' 
                WHERE username='$username';";
    }

    public function selectAuthKey($username)
    {
        return "SELECT authentication_key FROM $this->table WHERE username='$username';";
    }
}

?>