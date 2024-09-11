import { Component, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of } from 'rxjs';
import { FolderDto, AssetDto, PathToRootDto } from 'src/app/lib/openapi-generated/models';
import { FileManagementService } from '../service/file-management.service';
import { pathToRoot, addFolder, fetchFoldersByParentIdData, fetchAssetsByFolderIdData, pathToRootSuccess, trashFolder } from '../store/file-manager.actions';
import { FileManagerState } from '../store/file-manager.reducer';
import { selectFolders, selectAssets, selectPathToRoot } from '../store/file-manager-selector';

@Component({
  selector: 'app-file-manager-view',
  templateUrl: './file-manager-view.component.html',
  styleUrl: './file-manager-view.component.scss'
})
export class FileManagerViewComponent {
  folders$: Observable<FolderDto[]> = of([]);
  assets$: Observable<AssetDto[]> = of([]);
  pathToRoot$: Observable<PathToRootDto[]> = of([]);

  // bread crumb items
  breadCrumbItems: Array<{}>;
  radialoptions: any;
  public isCollapsed: boolean = false;
  dismissible = true;

  modalRef?: BsModalRef;
  createFolderForm = this.formBuilder.group({
    folderName: [''],
  });
  currentFolderId: number | null = null;

  constructor(
    private store: Store<FileManagerState>,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private fileManagementService: FileManagementService,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{label: 'Apps'}, {label: 'File Manager', active: true}];

    this.currentFolderId = this.route.snapshot.queryParams.folderId || null;

    this.folders$ = this.store.select(selectFolders);
    this.assets$ = this.store.select(selectAssets);
    this.pathToRoot$ = this.store.select(selectPathToRoot);

    this.radialoptions = {
      series: [76],
      chart: {
        height: 150,
        type: 'radialBar',
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#556ee6'],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: '#e7e7e7',
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: '60%',
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: '16px',
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      stroke: {
        dashArray: 3,
      },
      labels: ['Storage'],
    };

    this.openFolder(this.currentFolderId);
    if (this.currentFolderId) {
      this.store.dispatch(pathToRoot({folderId: this.currentFolderId}));
    }
  }

  getIconByExtension(name: string): string {
    const extension = name.split('.').pop();
    const icons = {
      'html': 'mdi mdi-file-document',
      'txt': 'mdi mdi-text-box text-muted',
      'png': 'mdi mdi-image text-success',
      'jpeg': 'mdi mdi-image text-muted',
      'zip': 'mdi mdi-folder-zip text-warning',
      'folder': 'mdi mdi-folder text-warning',
    };

    return icons[extension.toLowerCase()] || 'bx bxs-file';
  }

  getFileSize(sizeInKB: number): string {
    if (sizeInKB < 1024) {
      return `${sizeInKB} KB`;
    } else if (sizeInKB >= 1024 && sizeInKB < 1048576) {
      return `${(sizeInKB / 1024).toFixed(2)} MB`;
    } else {
      return `${(sizeInKB / 1048576).toFixed(2)} GB`;
    }
  }

  openModal(template: TemplateRef<any>) {
    const config: any = {
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
  }
  onCreateFolderFormSubmit() {
    this.store.dispatch(
      addFolder({
        folder: {
          body: {
            name: this.createFolderForm.value.folderName,
          },
        },
      }),
    );
    this.createFolderForm.reset();
    this.modalRef?.hide();
  }

  trashFolder(folderId: number) {
    this.store.dispatch(trashFolder({folderId}));
  }

  openFolder(folderId: number) {
    this.currentFolderId = folderId;
    this.store.dispatch(fetchFoldersByParentIdData({parentId: folderId}));
    this.store.dispatch(fetchAssetsByFolderIdData({folderId}));
    if (folderId) {
      this.store.dispatch(pathToRoot({folderId}));
    } else {
      this.store.dispatch(pathToRootSuccess({path: []}));
    }
  }

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      // Call your backend to get the pre-signed URL
      this.fileManagementService.uploadFile(this.selectedFile, this.currentFolderId);
      this.modalRef?.hide();
      this.openFolder(this.currentFolderId);
    }
  }
}
