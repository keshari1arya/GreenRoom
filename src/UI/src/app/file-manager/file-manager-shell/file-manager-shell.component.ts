import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { FileManagementService } from "../service/file-management.service";
import { FileManagerState } from "../store/file-manager.reducer";
import { Observable, of } from "rxjs";
import {
  AssetDto,
  FolderDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
} from "src/app/lib/openapi-generated/models";
import {
  selectFolders,
  selectAssets,
  selectPathToRoot,
  selectTrashedItems,
} from "../store/file-manager-selector";
import {
  addFolder,
  fetchAssetsByFolderIdData,
  fetchFoldersByParentIdData,
  fetchTrashedItems,
  pathToRoot,
  restoreAssets,
  restoreFolders,
  searchFoldersAndAssets,
  trashAssets,
  trashFolder,
} from "../store/file-manager.actions";

@Component({
  selector: "app-file-manager-shell",
  templateUrl: "./file-manager-shell.component.html",
  styleUrl: "./file-manager-shell.component.scss",
})
export class FileManagerShellComponent implements OnInit {
  folders$: Observable<FolderDto[]> = of([]);
  assets$: Observable<AssetDto[]> = of([]);
  pathToRoot$: Observable<PathToRootDto[]> = of([]);
  trashedItems$: Observable<TrashFolderAndFilesDto[]> = of([]);

  currentFolderId: number | null = null;

  constructor(
    private store: Store<FileManagerState>,
    private route: ActivatedRoute,
    private fileManagementService: FileManagementService
  ) {
    this.folders$ = this.store.select(selectFolders);
    this.assets$ = this.store.select(selectAssets);
    this.pathToRoot$ = this.store.select(selectPathToRoot);
    this.trashedItems$ = this.store.select(selectTrashedItems);
  }

  ngOnInit(): void {
    this.currentFolderId = this.route.snapshot.queryParams.folderId || null;

    this.openCurrentFolder();
  }

  setCurrentFolderId(folderId: number): void {
    this.currentFolderId = folderId;
    this.openCurrentFolder();
  }

  trashFolders(folderIds: number[]): void {
    this.store.dispatch(trashFolder({ folderIds }));
  }

  addFolder(name: string): void {
    this.store.dispatch(
      addFolder({
        folder: {
          body: {
            name: name,
            parentFolderId: this.currentFolderId,
          },
        },
      })
    );
  }

  fileUpload(file: File): void {
    this.fileManagementService.uploadFile(file, this.currentFolderId);
    this.openCurrentFolder();
  }

  restoreItems(items: TrashFolderAndFilesDto[]): void {
    const folderIds = items
      .filter((item) => item.isFolder)
      .map((item) => item.id);
    const assetIds = items
      .filter((item) => !item.isFolder)
      .map((item) => item.id);
    if (folderIds.length) {
      this.store.dispatch(restoreFolders({ folderIds }));
    }
    if (assetIds.length) {
      this.store.dispatch(restoreAssets({ assetIds }));
    }
  }

  fetchTrashedItems(): void {
    this.store.dispatch(fetchTrashedItems());
  }

  trashAsset($event: number) {
    this.store.dispatch(trashAssets({ assetIds: [$event] }));
  }

  search(term: string) {
    if (!term) {
      this.openCurrentFolder();
      return;
    }

    this.store.dispatch(
      searchFoldersAndAssets({
        searchQuery: term,
        parentId: this.currentFolderId,
      })
    );
  }

  private openCurrentFolder(): void {
    this.store.dispatch(
      fetchFoldersByParentIdData({ parentId: this.currentFolderId })
    );
    this.store.dispatch(
      fetchAssetsByFolderIdData({ folderId: this.currentFolderId })
    );

    if (this.currentFolderId) {
      this.store.dispatch(pathToRoot({ folderId: this.currentFolderId }));
    }
  }
}
