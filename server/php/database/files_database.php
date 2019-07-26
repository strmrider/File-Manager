<?php
include "query_builder/files_db_query_builder.php";


class FilesDatabase
{
    private $connection;
    private $queryBuilder;

    function __construct($server, $username, $password, $dbName, $user)
    {
        $this->connection = new mysqli(
            $server, $username, $password, $dbName);

        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }

        $this->queryBuilder = new FilesDbQueryBuilder($user, "files");
    }

    function __destruct() {
        $this->close();
    }

    public function close()
    {
        mysqli_close($this->connection);
    }

    public function selectRecords($ids)
    {
        if ($ids)
        { 
            $rows = $this->connection->query(
                $this->queryBuilder->selectRecordsByIds($ids));
        }
        else
            $rows = $this->connection->query(
                $this->queryBuilder->selectRecords());

        $records = array();
        if ($rows->num_rows > 0)
        {
            while($row = $rows->fetch_assoc())
                array_push($records, $row);
        }
        return $records;
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
        return $this->connection->query($this->queryBuilder->newTable());
    }

    public function updateDate($ids, $option, $date)
    {
        $query;
        if ($option == DATES::$MOD)
            $query = $this->queryBuilder->updateModeDate($ids, $date);
        else if ($option == DATES::$ACCESS)
            $query = $this->queryBuilder->updateAccessDate($ids, $date);
        
        return $this->connection->query($query);
    }

    public function newFile($args)
    { 
        if($this->connection->query($this->queryBuilder->newFile($args)))
            return true;
        else
            return false;
    }

    public function getChildsForDeletion($ids)
    {
        $rows = $this->connection->query($this->queryBuilder->getChilds($ids));
        $childs_ids = array();
        $extensions = array();
        $types = array();

        if ($rows && $rows->num_rows == 0)
            return null;
        if ($rows && $rows->num_rows > 0)
        {
            while($row = $rows->fetch_assoc())
                {
                    array_push($childs_ids, $row["id"]);
                    array_push($types, $row["type"]);
                    array_push($extensions, $row["extension"]);
                }
        }

        return array($childs_ids, $types, $extensions);
    }

    public function getFullChilds($ids)
    {
        $rows = $this->connection->query($this->queryBuilder->getChilds($ids));
        $records = array();

        if ($rows && $rows->num_rows == 0)
            return null;
        if ($rows && $rows->num_rows > 0)
        {
            while($row = $rows->fetch_assoc())
                array_push($records, $row);
        }

        return $records;
    }
    
    public function removeFiles($ids)
    {
        return $this->connection->query($this->queryBuilder->remove($ids));
    }

    public function moveFiles($ids, $parent)
    {
        return $this->connection->query(
            $this->queryBuilder->moveFiles($ids, $parent));
    }

    public function deletionUpdate($ids, $status)
    {
        return $this->connection->query(
            $this->queryBuilder->deletionUpdate($ids, $status));
    }

    public function rename($id, $newName, $date)
    {
        return $this->connection->query(
            $this->queryBuilder->rename($id, $newName, $date));
    }

    public function starStatus($ids, $status, $date)
    {
        return $this->connection->query(
            $this->queryBuilder->starStatus($ids, $status, $date));
    }

    public function noteUpdate($id, $note, $date)
    {
        return $this->connection->query(
            $this->queryBuilder->noteUpdate($id, $note, $date));
    }

    public function accessDateUpdate($id, $date)
    {
        return $this->connection->query(
            $this->queryBuilder->accessDate($id, $date));
    }

    public function newAccountRootDir($username, $date)
    {
        $args = array($username, "0", "Main", "-", "0", "-", "", "0", "0","0", $date, $date, $date, "", "");
        return $this->newFile($args);
    }
}

?>