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
  @Output() restoreItemsEvent = new EventEmitter<TrashFolderAndFilesDto[]>();

  constructor(public utility: Utility) {}

  restoreItem(item: TrashFolderAndFilesDto): void {
    this.restoreItemsEvent.emit([item]);
  }
}
