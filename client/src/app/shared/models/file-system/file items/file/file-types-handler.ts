import { FileType } from "src/app/shared/enums/file-type";
import { FileItem } from "../file-item";
import { File } from "./file";

export class FileTypesHandler {
  private static Text = ["txt"];
  private static Images = ["bmp", "gif", "jpg", "jpeg", "png", "svg"];
  private static Video = [
    "avi",
    "flv",
    "m4v",
    "mkv",
    "mov",
    "mp4",
    "mpg",
    "mpeg",
    "wmv"
  ];
  private static Audio = [
    "aif",
    "mid",
    "midi",
    "mp3",
    "mpa",
    "ogg",
    "wav",
    "wma"
  ];
  constructor() {}

  static convertFromDB(type) {
    switch (type) {
      case 0:
        return FileType.Root;
      case 1:
        return FileType.Directory;
      case 11:
        return FileType.Text;
      case 20:
        return FileType.Image;
      case 21:
        return FileType.Video;
      case 22:
        return FileType.Audio;
      case 23:
        return FileType.App;
      case 24:
        return FileType.Generic;
      case 10:
        return FileType.Shortcut;
    }
  }

  static convertFromExtension(extension: string) {
    if (this.inArray(this.Text, extension)) return FileType.Text;
    else if (this.inArray(this.Images, extension)) return FileType.Image;
    else if (this.inArray(this.Video, extension)) return FileType.Video;
    else if (this.inArray(this.Audio, extension)) return FileType.Audio;
    else return FileType.Generic;
  }

  private static inArray(arr, val: string) {
    for (let i = 0; arr.length; i++) {
      if (val == arr[i]) return true;
    }

    return false;
  }

  private static microsoftOffice(extension) {
    switch (extension) {
      case "doc":
        return "Microsoft Word Document";
      case "docx":
        return "Microsoft Word Open XML Document";
      case "pps":
        return "PowerPoint Slide Show";
      case "ppt":
        return "PowerPoint Presentation";
      case "pptx":
        return "PowerPoint Open XML Presentation";
      case "xls":
        return "Excel Spreadsheet";
      case "xlsx":
        return "PMicrosoft Excel Open XML Spreadsheet";
      default:
        return null;
    }
  }

  private static executable(extension) {
    switch (extension) {
      case "apk":
        return "Android Package File";
      case "bat":
        return "DOS Batch File";
      case "exe":
        return "Windows Executable File";
      case "jar":
        return "Java Archive File";
      default:
        return null;
    }
  }

  private static webFiles(extension) {
    switch (extension) {
      case "asp":
      case "aspx":
        return "Active Server Page";
      case "css":
        return "Cascading Style Sheet";
      case "htm":
      case "html":
        return "Hypertext Markup Language File";
      case "js":
        return "JavaScript File";
      case "jsp":
        return "Java Server Page";
      case "php":
        return "PHP Source Code File";
      case "rss":
        return "Rich Site Summary";
      default:
        return null;
    }
  }

  private static sysFiles(extension) {
    switch (extension) {
      case "dll":
        return "Dynamic Link Library";
      case "ico":
        return "Icon File";
      case "lnk":
        return "Windows File Shortcut";
      case "sys":
        return "Windows System File";
      default:
        return null;
    }
  }

  private static developerFiles(extension: string) {
    switch (extension) {
      case "c":
        return "C/C++ Source Code File";
      case "cpp":
        return "C++ Source Code File";
      case "cs":
        return "C# Source Code File";
      case "h":
        return "Header File";
      case "java":
        return "Java Source Code File";
      case "pl":
        return "Perl Script";
      case "rb":
        return "Ruby Script";
      case "py":
        return "Python Script";
      case "sh":
        return "Bash Shell Script";
      case "sln":
        return "Visual Studio Solution File";
      case "vb":
        return "Visual Basic Project Item File";
      case "VCXPROJ":
        return "Visual C++ Project";
      default:
        return null;
    }
  }

  private static others(extension: string) {
    switch (extension) {
      case "txt":
        return "Plain Text File";
      case "log":
        return "Log File";
      case "rtf":
        return "Rich Text Format File";
      case "csv":
        return "Comma Separated Values File";
      case "dat":
        return "Data File";
      case "key":
        return "Keynote Presentation";
      case "tar":
        return "Consolidated Unix File Archive";
      case "vcf":
        return "vCard File";
      case "xml":
        return "XML File";
      case "pdf":
        return "Portable Document Format File";
      case "sql":
        return "Structured Query Language Data File";
      case "7z":
        return "7-Zip Compressed File";
      case "rar":
        return "WinRAR Compressed Archive";
      case "zip":
        return "Zipped File";
      case "bin":
        return "Binary File";
      case "iso":
        return "Disc Image File";
      case "bak":
        return "Backup File";
      case "tmp":
        return "Temporary File";
      case "msi":
        return "Windows Installer Package";
      case "torrent":
        return "BitTorrent File";
      default:
        return null;
    }
  }

  private static miscFiles(extension) {
    var res = "";
    if (!(res = this.microsoftOffice(extension))) {
      if (!(res = this.executable(extension))) {
        if (!(res = this.webFiles(extension))) {
          if (!(res = this.sysFiles(extension))) {
            if (!(res = this.developerFiles(extension))) {
              if (!(res = this.others(extension))) return null;
            }
          }
        }
      }
    }

    return res;
  }

  static getDetailsIcon(type: FileType) {
    switch (type) {
      case FileType.Root:
      case FileType.Directory:
        return "fas fa-folder";
      case FileType.Text:
        return "fas fa-file-alt";
      case FileType.Image:
        return "fas fa-file-image";
      case FileType.Video:
        return "fas fa-file-video";
      case FileType.Audio:
        return "fas fa-file-audio";
      default:
        return "fas fa-file";
    }
  }

  static detailed(item: FileItem) {
    if (item.isDirectory) return "Folder";
    else if (item.type == FileType.Root) return "Root directory";
    else if (item.isShortcut) return "Shortcut";
    else if (item.type == FileType.Image) return "Image";
    else if (item.type == FileType.Video) return "Video";
    else if (item.type == FileType.Audio) return "Audio";
    else {
      let cast: any = item;
      let file: File = cast;
      let res = "";
      if ((res = this.miscFiles(file.extension))) return res;
      else return "Unknown";
    }
  }

  static icon(extension) {
    switch (extension) {
      case "docx":
        extension = "doc";
        break;
      case "pps":
        extension = "ppt";
        break;
    }
    switch (extension) {
      case "c":
      case "cpp":
      case "css":
      case "csv":
      case "dat":
      case "doc":
      case "exe":
      case "h":
      case "html":
      case "iso":
      case "java":
      case "js":
      case "key":
      case "pdf":
      case "php":
      case "ppt":
      case "py":
      case "rar":
      case "rb":
      case "rtf":
      case "sql":
      case "txt":
      case "xls":
      case "xlsx":
      case "zip":
        return extension;
      default:
        return "_blank";
    }
  }
}

export class FileTypeConverter {
  static convert(type) {
    switch (type) {
      case "text":
        return FileType.Text;
      case "image":
        return FileType.Image;
      case "video":
        return FileType.Video;
      case "audio":
        return FileType.Audio;
      case "application":
        return FileType.App;
      default:
        return FileType.Generic;
    }
  }

  static convertFromDB(type) {
    switch (type) {
      case 0:
        return FileType.Root;
      case 1:
        return FileType.Directory;
      case 11:
        return FileType.Text;
      case 20:
        return FileType.Image;
      case 21:
        return FileType.Video;
      case 22:
        return FileType.Audio;
      case 23:
        return FileType.App;
      case 24:
        return FileType.Generic;
      case 10:
        return FileType.Shortcut;
    }
  }
}
