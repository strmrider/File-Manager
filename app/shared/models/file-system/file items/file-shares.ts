export class FileShares {
  private usersList: Array<any>;
  constructor(usersList = null) {
    this.usersList = new Array();
    if (usersList) this.deserialize(usersList);
  }

  private deserialize(serializedList: string) {
    var users = serializedList.split(",");
    for (let i = 0; i < users.length; i++) {
      let user = users[i].split("|");
      this.addUser(user[0], user[1]);
    }
  }

  addUser(username: string, permit: any) {
    this.usersList.push({ username: username, permit: permit });
  }

  get count() {
    return this.usersList.length;
  }

  serialize() {
    var serializedList: string = "";
    for (let i = 0; i < this.usersList.length; i++) {
      let user =
        this.usersList[i]["username"] + "|" + this.usersList[i]["permit"];
      serializedList += user;
      if (i + 1 < this.usersList.length) serializedList += ",";
    }
    return serializedList;
  }
}
