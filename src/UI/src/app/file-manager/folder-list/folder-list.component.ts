import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { FolderDto } from "src/app/lib/openapi-generated/models/folder-dto";
import { selectPinnedFolders } from "../store/file-manager-selector";
import { pinnedFolderList, togglePinnedFolder } from "../store/file-manager.actions";

@Component({
  selector: "app-folder-list",
  templateUrl: "./folder-list.component.html",
  styleUrl: "./folder-list.component.scss",
})
export class FolderListComponent {
  @Input() folders: FolderDto[] = [];
  pinnedFolderList$: Observable<FolderDto[]>;

  @Output() openFolderEvent = new EventEmitter<number>();
  @Output() trashFolderEvent = new EventEmitter<number>();

  // Holds the pinned folders IDs
  pinnedFolders: number[] = [];

  constructor(private store: Store) {
    // Select pinned folders from the store
    this.pinnedFolderList$ = this.store.select(selectPinnedFolders);
  }

  ngOnInit(): void {
    // Dispatch to load pinned folders and subscribe to the pinned folders list
    this.store.dispatch(pinnedFolderList());
    this.pinnedFolderList$.subscribe((pinnedFolders: FolderDto[]) => {
      this.pinnedFolders = pinnedFolders.map(folder => folder.id);  // Get the folder IDs of pinned folders
    });
  }

  // Emit event to open the folder
  openFolder(folderId: number): void {
    this.openFolderEvent.emit(folderId);
  }

  // Emit event to trash (delete) the folder
  trashFolder(folderId: number): void {
    this.trashFolderEvent.emit(folderId);
  }

  // Pin or Unpin the folder
  togglePinFolder(folderId: number) {
    // Dispatch action to toggle pin/unpin
    this.store.dispatch(togglePinnedFolder({ folderId }));
  }

  // Check if a folder is pinned
  isFolderPinned(folderId: number): boolean {
    return this.pinnedFolders.includes(folderId);
  }
}
