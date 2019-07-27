export enum RequestType {
  RequestFailed = "-1",
  NewDir = "0",
  NewFile = "1",
  NewShortcut = "2",
  Move = "3",
  Deletion = "4",
  Restore = "5",
  Remove = "6",
  Rename = "7",
  UpdateNote = "8",
  Copy = "9",
  StarStatus = "10",
  Download = "11",
  AccessDate = "12",

  // account requests
  Login = "200",
  Autologin = "201",
  NewAccount = "202"
}
