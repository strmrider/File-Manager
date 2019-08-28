# File manager Server
Manages accounts, logins, files database and storage. Written in php and uses MySQL.
### Server directory
*php* folder containes the PHP files and the *storage* folder includes:
- *system*: Built in files used by the client (such as icons).
- *temp_zip_files*: temporary storage of download, zip generated, files.
- *users*: containes users files (subfolder for each user).

*Any modification should be updated in config.ini under 'storage' section*

## Setup
To setup the server follow these steps:
1. Copy the root folder *server* to your hosting server.
2. Run setup.php (placed in 'database' folder) to initialize the database. 
3. Use config.ini to set database settings (host, name, username and password).
