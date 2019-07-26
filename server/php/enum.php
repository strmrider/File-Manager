<?php
class FileType
{
    static $DIRECTORY = "0";
    static $SHORTCUT = "10";
}

class DATES
{
    static $MOD = "0";
    static $ACCESS = "1";
    static $CREATION = "2";
}

class REQUEST
{
    static $GET_FILE_SYSTEM = "100";
    static $NEW_DIR = "0";
    static $NEW_FILE = "1";
    static $NEW_SHORTCUT = "2";
    static $MOVE = "3";
    static $MOVE_TO_TRASH = "4";
    static $RESTORE = "5";
    static $REMOVE = "6";
    static $RENAME = "7";
    static $NOTE = "8";
    static $COPY = "9";
    static $STAR_STATUS = "10";
    static $DOWNLOAD = "11";
    static $UPDATE_ACCESS_DATE = "12";

    static $LOGIN = "200";
    static $AUTOLOGIN = "201";
    static $NEW_ACCOUNT = "202";
}
?>