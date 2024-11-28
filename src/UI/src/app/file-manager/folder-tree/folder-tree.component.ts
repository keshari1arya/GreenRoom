import { Component, Input } from "@angular/core";
import { FolderDto } from "src/app/lib/openapi-generated/models";
import { FileManagerState } from "../store/file-manager.reducer";
import { Store } from "@ngrx/store";
import { fetchFolderTree } from "../store/file-manager.actions";

@Component({
  selector: "app-folder-tree",
  templateUrl: "./folder-tree.component.html",
  styleUrl: "./folder-tree.component.scss",
})
export class SubFolderComponent {
  @Input() folders: FolderDto[] = [];

  constructor(private store: Store<FileManagerState>) {}
  public isCollapsed: { [key: number]: boolean } = {};
  public isExpanded: boolean = false;

  showTreeFolders() {
    this.store.dispatch(fetchFolderTree());
  }
}
