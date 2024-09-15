import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TrashFolderAndFilesDto } from "src/app/lib/openapi-generated/models";
import { Utility } from "../shared/classes/utility";

@Component({
  selector: "app-trashed-items",
  templateUrl: "./trashed-items.component.html",
  styleUrl: "./trashed-items.component.scss",
  providers: [Utility],
})
export class TrashedItemsComponent {
  @Input() trashedItems: TrashFolderAndFilesDto[] = [];
  @Output() restoreFoldersEvent = new EventEmitter<number[]>();

  constructor(public utility: Utility) {}

  restoreFolders(folderId: number): void {
    this.restoreFoldersEvent.emit([folderId]);
  }
}
