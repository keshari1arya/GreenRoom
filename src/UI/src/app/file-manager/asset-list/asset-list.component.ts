import { Component, Input } from "@angular/core";
import { AssetDto } from "src/app/lib/openapi-generated/models";
import { Utility } from "../shared/classes/utility";

@Component({
  selector: "app-asset-list",
  templateUrl: "./asset-list.component.html",
  styleUrl: "./asset-list.component.scss",
  providers: [Utility],
})
export class AssetListComponent {
  @Input() assets: AssetDto[] = [];

  constructor(public utility: Utility) {}
}
