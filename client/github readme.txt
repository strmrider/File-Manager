# FileManager
Online, single page application, file manager. Built with angular. 
Written in Typescript, html and css on front end and php on back end, Uses MySQL as database.

### [Demo site](https://file-manager-30b0d.web.app/)
## Features

#### File management:
- Supports directories, files and shortcuts.
- Upload and download of directories and files.
- Transfer, remove, restore, delete, edit and copy files.
- Search items, sort and and order.

#### UI:
- Includes navigation tools, context menues and toolbars.
- Supports drag and drop for transfer and file upload.
- Drag selection box for multiple selection.
- Includes keyboard support.
- Includes synchronization of browsers and tabs.

#### File preview:
- Supports preview of images, video, audio and text files;

## Configurations
The file [config.json](https://github.com/strmrider/file-manager/blob/master/src/assets/config.json) allows 
the configuration of host server's addresses and other app options.

#### Host server
Place your host server addresses where "HOST_SERVER_ADDRESS" is written (if the server's directories names or structure has been changed, 
then the rest of the address should be changed as well). Read Server section for more information about the storage directories.

##### Other options
Set true/false to turn on/off these options.

- *offline*. When set on, all tasks will be commited only on the local (client's) file system and will not be perfomed on the server 
(i.e changes wil not be saved).
- *browserSynch*. Allows the synchronization of browsers and tabs. When a task is being commited, all browsers and tabs on the machine will be
notified and updated.
- *autologin*. When enabled, the system remembers last logged in user and allows an automatic sign in.


## Server
Written in php and uses MySQL. Includes app's storage directories as well. Read the [README](https://github.com/strmrider/file-manager/blob/master/SERVER_README.md) file in the server's directory for extended details.
