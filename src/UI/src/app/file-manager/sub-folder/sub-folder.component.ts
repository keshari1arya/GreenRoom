import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { FolderDto } from "src/app/lib/openapi-generated/models";

@Component({
  selector: "app-sub-folder",
  templateUrl: "./sub-folder.component.html",
  styleUrl: "./sub-folder.component.scss",
})
export class SubFolderComponent {
  @Input() folders: FolderDto[] = [];
  public isCollapsed: { [key: number]: boolean } = {};
}
