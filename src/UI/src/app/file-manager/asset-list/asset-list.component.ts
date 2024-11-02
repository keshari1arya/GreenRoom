import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AssetDto } from "src/app/lib/openapi-generated/models";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrl: "./asset-list.component.scss",
})
export class AssetListComponent {
  @Input() assets: AssetDto[] = [];
  @Output() trashAssetEvent = new EventEmitter<number>();

  constructor() {}

  trashAsset(id: number) {
    this.trashAssetEvent.emit(id);
  }
}
