import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { AssetDto } from "src/app/lib/openapi-generated/models";
import { Utility } from "../shared/classes/utility";
import { ModalDirective } from "ngx-bootstrap/modal";
import { of } from "rxjs";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrl: "./asset-list.component.scss",
  providers: [Utility],
})
export class AssetListComponent {
  @Input() assets: AssetDto[] = [];
  @Output() trashAssetEvent = new EventEmitter<number>();

  constructor(public utility: Utility) {}

  trashAsset(id: number) {
    this.trashAssetEvent.emit(id);
  }
}
