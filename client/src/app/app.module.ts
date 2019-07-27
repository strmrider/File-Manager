import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from "./components/account/login/login.component";
import { SystemService } from "./services/system/system.service";
import { AccountService } from "./services/account/account.service";
import { DragAndDropIconComponent } from "./components/file-manager/drag-and-drop-icon/drag-and-drop-icon.component";
import { InputUploadComponent } from "./components/upload-manager/input-upload/input-upload.component";
import { UploadManagerItemComponent } from "./components/upload-manager/upload-manager-item/upload-manager-item.component";
import { UploadManagerComponent } from "./components/upload-manager/upload-manager/upload-manager.component";
import { ContextmenuComponent } from "./components/contextmenu/contextmenu/contextmenu.component";
import { ContextmenuFrameComponent } from "./components/contextmenu/contextmenu-frame/contextmenu-frame.component";
import { DirViewComponent } from "./components/file-manager/dir-view/dir-view/dir-view.component";
import { FileViewComponent } from "./components/file-manager/dir-view/file-view/file-view.component";
import { DragSelectionBoxComponent } from "./components/file-manager/dir-view/drag-selection-box/drag-selection-box.component";
import { FileManagerComponent } from "./components/file-manager/file-manager/file-manager.component";
import { NavTreeItemComponent } from "./components/file-manager/nav-tree/nav-tree-item/nav-tree-item.component";
import { DirTreeComponent } from "./components/file-manager/nav-tree/dir-tree/dir-tree.component";
import { NavTreeComponent } from "./components/file-manager/nav-tree/nav-tree/nav-tree.component";
import { ToolbarComponent } from "./components/file-manager/toolbar/toolbar.component";
import { PathBarItemComponent } from "./components/file-manager/path-bar/path-bar-item/path-bar-item.component";
import { PathBarComponent } from "./components/file-manager/path-bar/path-bar/path-bar.component";
import { MainFrameComponent } from "./components/main-frame/main-frame.component";
import { FilePreviewComponent } from "./components/file-preview/file-preview.component";
import { TasksNotificationComponent } from "./components/tasks-notification/tasks-notification.component";
import { NameModalComponent } from "./components/modals/name-modal/name-modal.component";
import { TaskModalComponent } from "./components/modals/shared/task-modal/task-modal.component";
import { MoveModalItemComponent } from "./components/modals/move-modal-pack/move-modal-item/move-modal-item.component";
import { MoveModalComponent } from "./components/modals/move-modal-pack/move-modal/move-modal.component";
import { FileDetailsItemComponent } from "./components/file-details-pack/file-details-item/file-details-item.component";
import { FileDetailsFrameComponent } from "./components/file-details-pack/file-details-frame/file-details-frame.component";
import { FileDetailsContentComponent } from "./components/file-details-pack/file-details-content/file-details-content.component";
import { MessageModalComponent } from "./components/modals/message-modal/message-modal.component";
import { UserBarComponent } from "./components/user-bar/user-bar.component";
import { CreateAccountComponent } from './components/account/create-account/create-account.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileManagerComponent,
    DragAndDropIconComponent,
    InputUploadComponent,
    UploadManagerComponent,
    UploadManagerItemComponent,
    UploadManagerComponent,
    ContextmenuComponent,
    ContextmenuFrameComponent,
    DirViewComponent,
    FileViewComponent,
    DragSelectionBoxComponent,
    NavTreeComponent,
    NavTreeItemComponent,
    DirTreeComponent,
    ToolbarComponent,
    PathBarItemComponent,
    PathBarComponent,
    MainFrameComponent,
    FilePreviewComponent,
    TasksNotificationComponent,
    TaskModalComponent,
    NameModalComponent,
    MoveModalItemComponent,
    MoveModalComponent,
    FileDetailsItemComponent,
    FileDetailsFrameComponent,
    FileDetailsContentComponent,
    MessageModalComponent,
    UserBarComponent,
    CreateAccountComponent,
    LoaderComponent
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [SystemService, AccountService],
  bootstrap: [AppComponent]
})
export class AppModule {}
