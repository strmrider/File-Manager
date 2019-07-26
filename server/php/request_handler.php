<?php
include_once  "database/accounts_database.php";
include_once  "database/files_database.php";
include_once  "database/accounts_database.php";
include_once  "enum.php";

class RequestHandler
{
    private $database;
    private $username;
    private $accountHandler;
    private $usersStorage;
    private $zipStorage;
    function __construct($ini)
    {
        $this->usersStorage = $ini["file_storage"];
        $this->zipStorage = $ini["temp_zip_files"];
        $this->username = $_POST["username"];
        $this->database = new FilesDatabase($ini["db_server"], $ini["db_username"], 
                                            $ini["db_password"], $ini["db_name"], $this->username);
        $this->accountHandler = new AccountHandler($ini);
    }

    private function getFilesFromDatabase() {
        return $this->database->selectRecords(null);
    }


    private function getFilePath($file)
    {
        $extension = explode(".", $file[2]);
        $extension = $extension[sizeof($extension)-1];
        $root = realpath(dirname(__FILE__)."/../");
        $targetFile = "$root/$this->usersStorage/$this->username/".$file[1].".".$extension;

        return $targetFile;
    }

    private function splitExtension($fullname)
    {
        $extension = explode(".", $fullname);
        $extension = $extension[sizeof($extension)-1];

        return $extension;
    }

    private function verifyAuthKey($authKey)
    {
        return $this->accountHandler->verifyAuthKey($this->username, $authKey);
    }

    private function demoDatabaseRequest()
    {
        return ($_POST["username"] == "Guest" &&  $_POST["request"] == REQUEST::$GET_FILE_SYSTEM);
    }

    /************
     * New files 
     ************/
    private function getNewFileProperties()
    {
        $size="0";
        $reference="";
        $extension = "";
        if ($_POST["type"] == FileType::$SHORTCUT)
            $reference = $_POST["reference"];
        else if ($_POST["type"] != FileType::$DIRECTORY){
            $size= $_POST["size"];
            $extension = $_POST["extension"];
        }

        $props = array($this->username, $_POST["id"], $_POST["name"],
                $extension, $_POST["type"], $_POST["parent"],  $_POST["shares"],
                $_POST["deleted"],  $_POST["star"], $size,
                $_POST["creation_date"], $_POST["access_date"], 
                $_POST["modification_date"], $_POST["note"], $reference);
        return $props;
    }

    private function newNonUploadedFile()
    {
        $props = $this->getNewFileProperties();
        if ($this->database->newFile($props))
            return $this->database->updateDate(
                array($_POST["parent"]), DATES::$MOD, $_POST["creation_date"]);
        else
            return false;
    }

    private function handleFileUpload()
    {
        $file = $this->getNewFileProperties();
        $targetFile = $this->getFilePath($file);
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFile))
        {
            // saves file in db
            if ($this->database->newFile($file) )
                return true;
            else
                unlink($targetFile);
        }

        return false;
    }

    private function copyFile()
    {
        $file = $this->getNewFileProperties();
        $extension = $this->splitExtension($file[2]);
        $root = realpath(dirname(__FILE__)."/../");
        echo $root;
        $sourceFile = "$root/$this->usersStorage/$this->username/".
        $_POST["source"].".".$extension;
        $targetFile = "$root/$this->usersStorage/$this->username/".$file[1].".".$extension;

        if (copy($sourceFile, $targetFile))
        {
            if( $this->database->newFile($this->getNewFileProperties()))
                return $this->database->updateDate(
                    array($_POST["parent"]), DATES::$MOD, $_POST["creation_date"]);
        }
        else
            return false;
    }

    /**************************
     * Files removal deletions 
     **************************/
    private function removeFiles()
    {
        return $this->_removeFiles($_POST["id"], $_POST["type"], $_POST["extension"]);
    }

    private function _removeFiles($ids, $types, $extensions)
    {
        $childs = $this->database->getChildsForDeletion($ids);
        if ($childs){
            $this->_removeFiles($childs[0], $childs[1], $childs[2]);
        }

        return $this->removeFilesFromStorage($ids, $types, $extensions);
    }

    private function removeFilesFromStorage($ids, $types, $extensions)
    {
        $result = $this->database->removeFiles($ids);

        if ($result)
        {
            $root = realpath(dirname(__FILE__)."/../");
            $targetFile = "$root/$this->usersStorage/$this->username/";
            $len = sizeof($ids);
            for($i=0; $i<$len; $i++)
            {
                if($types[$i] != "1" && $types[$i] != "0" && $types[$i] != "10"){
                    unlink($targetFile.$ids[$i].".".$extensions[$i]);
                }
            }
        }

        return $result;
    }

    private function deletionUpdate($status)
    {
        $statusUpdate = $this->database->deletionUpdate(
            $_POST["id"], $status);
        if ($statusUpdate)
        {
            return $this->database->updateDate(
                $_POST["updatedDir"], DATES::$MOD, $_POST["date"]);
        }
        else 
            return false;
    }

    /******************
     * Files downalod 
     ******************/
    private function getExtensionForDownload($name, $extension)
    {
        $lastChars = '';
        for($i=strlen($name)-1; $i>0; $i--) 
        {
            if ($name[$i] == ".")
                break;
            else
                $lastChars = $lastChars.$name[$i];
        }
        $lastChars = strrev($lastChars);
        if($lastChars != $extension)
            return $lastChars;
        else
            return "";
    }

    private function download()
    {
        $filename = $_POST["filename"];
        $serverRoot = realpath(dirname(__FILE__)."/../");
        $root = "downloads";
        $zip = new ZipArchive;
        if ($zip->open("$serverRoot/$this->zipStorage/".$filename, ZipArchive::CREATE) === TRUE) {
            if($zip->addEmptyDir($root)) {
                $records = $this->database->selectRecords($_POST["id"]);
                $this->zipFiles($zip, $records, $root);
            }
            $zip->close();
            return true;
        }
        $zip->close();
        return false;
    }

    private function zipFiles($zip, $files, $currentPath)
    {
        $len = sizeof($files);
        for($i=0; $i<$len; $i++)
        {
            if($files[$i]["type"] == "1")
            {
                $newPath = $currentPath."/".$files[$i]["name"];
                $childs = $this->database->getFullChilds([$files[$i]["id"]]);
                $zip->addEmptyDir($newPath);
                $this->zipFiles($zip, $childs, $newPath);
            }
            else
                $this->addFileToZip($zip, $files[$i], $currentPath);
        }
    }

    private function addFileToZip($zip, $file, $path)
    {
        $root = realpath(dirname(__FILE__)."/../");
        $sourcePath = "$root/$this->usersStorage/$this->username/";
        $extension = $this->getExtensionForDownload(
            $file["name"], $file["extension"]);
        $target = $path."/".$file["name"].".".$extension;
        $source = $sourcePath.$file["id"].".".$file["extension"];
        $zip->addFile($source, $target);
    }

    /**************************
     * Other properties updates
     **************************/
    private function moveFiles()
    {
        $move = $this->database->moveFiles($_POST["id"], $_POST["targetParent"]);
        if ($move)
        {
            $parents = array($_POST["targetParent"], $_POST["sourceParent"]);
            return $this->database->updateDate($parents, DATES::$MOD, $_POST["date"]);
        }
        else
            return false;
    }

    private function rename()
    {
        return $this->database->rename($_POST["id"], $_POST["name"],
         $_POST["date"]);
    }

    private function note()
    {
        return $this->database->noteUpdate($_POST["id"], $_POST["note"], 
                                            $_POST["date"]);
    }

    private function starStatus()
    {
        return $this->database->starStatus($_POST["id"], $_POST["status"], 
                                            $_POST["date"]);
    }

    private function updateAccessDate()
    {
        return $this->database->accessDateUpdate($_POS["id"], $_POS["date"]);
    }


    function handle()
    {
        if(!$this->verifyAuthKey($_POST["authKey"]) && !$this->demoDatabaseRequest()){
            return false;
        }

        $request = $_POST["request"];
        switch($request)
        {
            case REQUEST::$GET_FILE_SYSTEM:
                return json_encode($this->getFilesFromDatabase());
            case REQUEST::$NEW_DIR:
            case REQUEST::$NEW_SHORTCUT:
                return $this->newNonUploadedFile();
            case REQUEST::$NEW_FILE:
                return $this->handleFileUpload();
            case REQUEST::$REMOVE:
                return $this->removeFiles();
            case REQUEST::$MOVE:
                return $this->moveFiles();
            case REQUEST::$MOVE_TO_TRASH:
                return $this->deletionUpdate("1");
            case REQUEST::$RESTORE:
                return $this->deletionUpdate("0");
            case REQUEST::$RENAME: 
                return $this->rename();
            case REQUEST::$COPY: 
                return $this->copyFile();
            case REQUEST::$STAR_STATUS: 
                return $this->starStatus();
            case REQUEST::$NOTE: 
                return $this->note();
            case REQUEST::$DOWNLOAD: 
                return $this->download();
            case REQUEST::$UPDATE_ACCESS_DATE: 
                return $this->updateAccessDate();
        }
    }


}
?>