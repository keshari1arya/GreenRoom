import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TrashFolderAndFilesDto } from "src/app/lib/openapi-generated/models";

@Component({
  selector: "app-trashed-items",
  templateUrl: "./trashed-items.component.html",
  styleUrl: "./trashed-items.component.scss",
})
export class TrashedItemsComponent {
  @Input() trashedItems: TrashFolderAndFilesDto[] = [];
  @Output() restoreItemsEvent = new EventEmitter<TrashFolderAndFilesDto[]>();

  constructor() {}

  restoreItem(item: TrashFolderAndFilesDto): void {
    this.restoreItemsEvent.emit([item]);
  }
}
