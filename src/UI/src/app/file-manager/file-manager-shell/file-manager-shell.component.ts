import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { BsModalService } from "ngx-bootstrap/modal";
import { FileManagementService } from "../service/file-management.service";
import { FileManagerState } from "../store/file-manager.reducer";
import { Observable, of } from "rxjs";
import {
  AssetDto,
  FolderDto,
  PathToRootDto,
} from "src/app/lib/openapi-generated/models";
import {
  selectFolders,
  selectAssets,
  selectPathToRoot,
} from "../store/file-manager-selector";
import {
  addFolder,
  fetchAssetsByFolderIdData,
  fetchFoldersByParentIdData,
  pathToRoot,
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

  currentFolderId: number | null = null;

  constructor(
    private store: Store<FileManagerState>,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fileManagementService: FileManagementService
  ) {
    this.folders$ = this.store.select(selectFolders);
    this.assets$ = this.store.select(selectAssets);
    this.pathToRoot$ = this.store.select(selectPathToRoot);
  }

  ngOnInit(): void {
    this.currentFolderId = this.route.snapshot.queryParams.folderId || null;

    this.store.dispatch(
      fetchFoldersByParentIdData({ parentId: this.currentFolderId })
    );
    this.store.dispatch(
      fetchAssetsByFolderIdData({ folderId: this.currentFolderId })
    );
    this.openCurrentFolder();

    if (this.currentFolderId) {
      this.store.dispatch(pathToRoot({ folderId: this.currentFolderId }));
    }
  }

  setCurrentFolderId(folderId: number): void {
    this.currentFolderId = folderId;
    this.openCurrentFolder();
  }

  trashFolder(folderId: number): void {
    this.store.dispatch(trashFolder({ folderId }));
  }

  addFolder(name: string): void {
    this.store.dispatch(
      addFolder({
        folder: {
          body: {
            name: name,
          },
        },
      })
    );
  }

  fileUpload(file: File): void {
    this.fileManagementService.uploadFile(file, this.currentFolderId);
    this.openCurrentFolder();
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
