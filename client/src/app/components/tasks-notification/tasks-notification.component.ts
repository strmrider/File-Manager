import { Component, OnInit } from "@angular/core";
import { FileSystemTasks } from "src/app/shared/enums/files-system-tasks";
import { TasksService } from "src/app/services/tasks/tasks-service/tasks.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "tasks-notification",
  templateUrl: "./tasks-notification.component.html",
  styleUrls: ["./tasks-notification.component.css"]
})
export class TasksNotificationComponent implements OnInit {
  public message: string = "";
  public _visibility: boolean = false;
  private task: {};
  private undoneBtnVisibility = false;
  private timeLeft: number = 60;
  private timeInterval;
  constructor(private tasks: TasksService) {
    tasks.notifyStartEmitter.subscribe(task => {
      this.notifyTaskProcess(task);
    });

    tasks.notifyEndEmitter.subscribe(result => {
      this.notifyTaskEnd(result);
    });
  }

  ngOnInit() {}

  get visibility() {
    return Utilities.visibility(this._visibility);
  }

  notifyTaskProcess(task: {}) {
    this.task = task;
    this.message = this.task["startMessage"];
    this._visibility = true;
    this.timer();
  }

  notifyTaskEnd(success: boolean) {
    if (success) this.message = this.task["endMessage"];
    else this.message = "task failed";
    if (this.task["task"] != FileSystemTasks.RemoveFromTrash) {
      this.undoneBtnVisibility = true;
    } else this.undoneBtnVisibility = false;

    this.timer();
  }

  undoneDisplay() {
    return Utilities.visibility(this.undoneBtnVisibility);
  }

  close() {
    clearInterval(this.timeInterval);
    this._visibility = false;
    this.message = "";
    this.task = null;
  }

  /* Undo last task*/
  undo() {
    switch (this.task["task"]) {
      case FileSystemTasks.Transfer:
        this.tasks.moveFiles(
          this.task["source"],
          this.task["target"],
          this.task["files"],
          false
        );
        break;
      case FileSystemTasks.Remove:
        this.tasks.restore(this.task["files"], false);
        break;
      case FileSystemTasks.Restore:
        this.tasks.removeFiles(this.task["files"], false);
        break;
      case FileSystemTasks.Rename:
        this.tasks.rename(this.task["file"], this.task["name"], false);
        break;
      case FileSystemTasks.Star:
        this.tasks.setStarStatus(
          this.task["files"],
          !this.task["status"],
          false
        );
        break;
      default:
        this.message = "";
        break;
    }

    this.message = "Operation undone";
    this.undoneBtnVisibility = false;
    this.timer();
  }

  private timer() {
    clearInterval(this.timeInterval);
    this.timeLeft = 6;
    this.timeInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.close();
      }
    }, 1000);
  }
}
