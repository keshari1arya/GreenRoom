import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FolderDto } from "src/app/lib/openapi-generated/models/folder-dto";

@Component({
  selector: "app-folder-list",
  templateUrl: "./folder-list.component.html",
  styleUrl: "./folder-list.component.scss",
})
export class FolderListComponent {
  @Input() folders: FolderDto[] = [];

  @Output() openFolderEvent = new EventEmitter<number>();
  @Output() trashFolderEvent = new EventEmitter<number>();

  trashFolder(folderId: number): void {
    this.trashFolderEvent.emit(folderId);
  }

  openFolder(folderId: number): void {
    this.openFolderEvent.emit(folderId);
  }
}
