import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AssetDto, FolderDto } from "src/app/lib/openapi-generated/models";
import { RootReducerState } from "src/app/store";
import { selectAssets, selectData, selectFolders } from "src/app/store/filemanager/filemanager-selector";
import { addFolder, fetchAssetsByFolderIdData, fetchFoldersByParentIdData, fetchRecentFilesData, trashFolder } from "src/app/store/filemanager/filemanager.actions";

@Component({
  selector: "app-filemanager",
  templateUrl: "./filemanager.component.html",
  styleUrls: ["./filemanager.component.scss"],
})
export class FileManagerComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  radialoptions: any;
  public isCollapsed: boolean = false;
  dismissible = true;
  Recentfile: any;
  folders: FolderDto[] = [];
  assets: AssetDto[] = [];
  modalRef?: BsModalRef;
  createFolderForm = this.formBuilder.group({
    folderName: [""],
  });

  constructor(
    public router: Router,
    private store: Store<{ data: RootReducerState }>,
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Apps" },
      { label: "File Manager", active: true },
    ];

    this.store.dispatch(fetchRecentFilesData());
    this.store.dispatch(fetchFoldersByParentIdData({ parentId: null }));
    this.store.dispatch(fetchAssetsByFolderIdData({ folderId: null }));

    this.store.select(selectData).subscribe((data) => {
      this.Recentfile = data;
    });

    this.store.select(selectFolders).subscribe((data) => {
      this.folders = data;
    });

    this.store.select(selectAssets).subscribe((data) => {
      this.assets = data;
    })

    this.radialoptions = {
      series: [76],
      chart: {
        height: 150,
        type: "radialBar",
        sparkline: {
          enabled: true,
        },
      },
      colors: ["#556ee6"],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: "60%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: "16px",
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
      labels: ["Storage"],
    };
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
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template, config);
  }
  onCreateFolderFormSubmit() {
    this.store.dispatch(addFolder({
      folder: {
        body: {
          name: this.createFolderForm.value.folderName,
        }
      }
    }));
    this.createFolderForm.reset();
    this.modalRef?.hide();
  }

  trashFolder(folderId: number) {
    this.store.dispatch(trashFolder({ folderId }));
  }
}
