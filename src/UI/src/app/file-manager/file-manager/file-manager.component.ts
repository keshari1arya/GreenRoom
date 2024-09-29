import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { debounceTime, distinctUntilChanged, of } from "rxjs";
import {
  FolderDto,
  AssetDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
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
  @Input() trashedItems: TrashFolderAndFilesDto[] = [];

  @Output() setCurrentFolderIdEvent = new EventEmitter<number>();
  @Output() trashFoldersEvent = new EventEmitter<number[]>();
  @Output() restoreFoldersEvent = new EventEmitter<number[]>();
  @Output() addFolderEvent = new EventEmitter<string>();
  @Output() fileUploadEvent = new EventEmitter<File>();
  @Output() fetchTrashedItemsEvent = new EventEmitter();
  @Output() searchEvent = new EventEmitter<string>();

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
  componentVisibilityStatus = {
    folders: true,
    assets: true,
    trashedItems: false,
  };
  searchControl = new FormControl("");

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

    this.showComponents(["folders", "assets"]);

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

    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.searchEvent.emit(value);
      });
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
    this.trashFoldersEvent.emit([folderId]);
  }

  openFolder(folderId: number) {
    if (folderId === null) {
      this.pathToRoot = [];
    }
    this.setCurrentFolderIdEvent.emit(folderId);
    this.showComponents(["folders", "assets"]);
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

  onTrashedItemsClick() {
    this.isCollapsed = true;
    this.fetchTrashedItemsEvent.emit();
    this.showComponents(["trashedItems"]);
  }

  showComponents(components: string[]) {
    this.hideAllComponents();
    components.forEach((component, index) => {
      if (!Object.keys(this.componentVisibilityStatus).includes(component)) {
        throw new Error("Invalid component name to show");
      }
      this.componentVisibilityStatus[component] = true;
    });
  }

  restoreFolders(folderIds: number[]) {
    this.restoreFoldersEvent.emit(folderIds);
  }

  private hideAllComponents() {
    Object.keys(this.componentVisibilityStatus).forEach((key) => {
      this.componentVisibilityStatus[key] = false;
    });
  }
}
