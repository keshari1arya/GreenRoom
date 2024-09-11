import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  FolderDto,
  AssetDto,
  PathToRootDto,
} from "src/app/lib/openapi-generated/models";

@Component({
  selector: "app-file-manager",
  templateUrl: "./file-manager.component.html",
  styleUrl: "./file-manager.component.scss",
})
export class FileManagerViewComponent {
  @Input() folders: FolderDto[] = [];
  @Input() assets: AssetDto[] = [];
  @Input() pathToRoot: PathToRootDto[] = [];

  @Output() setCurrentFolderIdEvent = new EventEmitter<number>();
  @Output() trashFolderEvent = new EventEmitter<number>();
  @Output() addFolderEvent = new EventEmitter<string>();
  @Output() fileUploadEvent = new EventEmitter<File>();

  // bread crumb items
  breadCrumbItems: Array<{}>;
  radialoptions: any;
  public isCollapsed: boolean = false;
  dismissible = true;

  modalRef?: BsModalRef;
  createFolderForm = this.formBuilder.group({
    folderName: [""],
  });
  currentFolderId: number | null = null;

  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Apps" },
      { label: "File Manager", active: true },
    ];

    // this.folders$ = this.store.select(selectFolders);
    // this.assets$ = this.store.select(selectAssets);
    // this.pathToRoot$ = this.store.select(selectPathToRoot);

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

  openModal(template: TemplateRef<any>) {
    const config: any = {
      backdrop: true,
      ignoreBackdropClick: true,
    };
    this.modalRef = this.modalService.show(template, config);
  }

  onCreateFolderFormSubmit() {
    const folderName = this.createFolderForm.value.folderName;
    this.addFolderEvent.emit(folderName);

    this.createFolderForm.reset();
    this.modalRef?.hide();
  }

  trashFolder(folderId: number) {
    this.trashFolderEvent.emit(folderId);
  }

  openFolder(folderId: number) {
    this.setCurrentFolderIdEvent.emit(folderId);
  }

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      this.fileUploadEvent.emit(this.selectedFile);
      this.modalRef?.hide();
    }
  }
}
