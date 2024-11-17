import { Component, EventEmitter, Input, Output } from "@angular/core";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import {
  AssetDto,
  PaginatedListOfAssetDto,
} from "src/app/lib/openapi-generated/models";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrl: "./asset-list.component.scss",
})
export class AssetListComponent {
  @Input() assets: PaginatedListOfAssetDto = {};
  @Output() trashAssetEvent = new EventEmitter<number>();
  @Output() pageChangedEvent = new EventEmitter<PageChangedEvent>();

  constructor() {}

  trashAsset(id: number) {
    this.trashAssetEvent.emit(id);
  }

  pageChanged($event: PageChangedEvent) {
    this.pageChangedEvent.emit($event);
  }
}
