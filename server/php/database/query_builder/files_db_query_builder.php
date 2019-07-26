<?php
class FilesDbQueryBuilder
{
    private $username = "";
    private $table="";

    public function __construct($username, $table)
    {
        $this->username = $username;
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
                id varchar(255),
                name varchar(255),
                extension varchar(10),
                type varchar(255),
                parent varchar(255),
                shares varchar(255),
                deleted varchar(1),
                star varchar(1),
                size varchar(255),
                creation_date varchar(255),
                access_date varchar(255),
                modification_date varchar(255),
                note varchar(255),
                reference varchar(255));";
    }

    public function dropTable()
    {
        return "DROP TABLE $this->table";
    }

    public function selectRecords()
    {
        return "SELECT * FROM $this->table WHERE username='$this->username';";
    }

    public function selectRecordsByIds($ids)
    {
        $idsList = implode("','", $ids);
        $idsList = "'".$idsList."'";
        $condition = "username='".$this->username."' AND id IN ($idsList)";
        return "SELECT * FROM $this->table WHERE username='$this->username' 
        AND id IN ($idsList);";
    }

    public function updateModeDate($ids, $date)
    {
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        $condition = "username='".$this->username."' AND id IN ($idsList)";
        $query = "UPDATE ".$this->table." set modification_date='".$date.
        "' WHERE ".$condition.";";

        return $query;
    }

    public function updateAccessDate($ids, $date)
    {
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        $condition = "username='".$this->username."' AND id IN ($idsList)";
        $query = "UPDATE ".$this->table." set access_date='".$date.
        "' WHERE ".$condition.";";

        return $query;
    }

    public function newFile($args)
    {
        $args = $this->addApostraphe($args);
        $values = implode(",", $args);
        $keys = "(username, id, name, extension, type, parent, shares, deleted, star, size, 
        creation_date, access_date, modification_date, note, reference)";
        return "INSERT INTO $this->table $keys VALUES ($values);";
    }

    public function getChilds($ids)
    {
        $username = $this->username;
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        return "SELECT * FROM $this->table WHERE username='$username' AND parent IN ($idsList);";
    }

    public function remove($ids)
    {
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        $idsCondition = "id IN ($idsList) OR reference IN ($idsList)";
        $query = "DELETE FROM $this->table WHERE username='$this->username'
         AND $idsCondition;";
        return $query;
    }

    public function moveFiles($ids, $target)
    {
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        $condition = "username='".$this->username."' AND id IN ($idsList)";
        $query = "UPDATE ".$this->table." set parent='".$target.
        "' WHERE ".$condition.";";

        return $query;
    }

    public function deletionUpdate($ids, $status)
    {
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        $condition = "username='$this->username' AND id IN ($idsList)";
        $operation = "deleted='$status'";
        return  "UPDATE $this->table set $operation WHERE $condition;";
    }

    public function rename($id, $newName, $date)
    {
        $condition = "username='$this->username' AND id='$id'"; 
        $query = "UPDATE $this->table set name='$newName', 
        modification_date='$date' WHERE $condition";

        return $query;
    }

    public function noteUpdate($id, $note, $date)
    {
        $condition = "username='$this->username' AND id='$id'";
        $operation = "note='$note', modification_date='$date'";
        return  "UPDATE $this->table set $operation WHERE $condition;";
    }

    public function starStatus($ids, $status, $date)
    {
        $ids = $this->addApostraphe($ids);
        $idsList = implode(",", $ids);
        $condition = "username='$this->username' AND id IN ($idsList)";
        $operation = "star='$status', modification_date='$date'";
        return  "UPDATE $this->table set $operation WHERE $condition;";
    }

    public function accessDate($id, $date)
    {
        $condition = "username='$this->username'";
        return  "UPDATE $this->table set  access_date='$date' WHERE $condition;";
    }
       
    
}

?>