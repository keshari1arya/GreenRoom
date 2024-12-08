import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { debounceTime, distinctUntilChanged, Observable } from "rxjs";
import {
  FolderDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
  BucketStorageStatusByAssetTypeDto,
  PaginatedListOfAssetDto,
} from "src/app/lib/openapi-generated/models";
import {
  pinnedFolderList,
  uploadFolderWithFolderAndFiles,
} from "../store/file-manager.actions";
import { selectPinnedFolders } from "../store/file-manager-selector";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
import { ActivatedRoute } from "@angular/router";
import BulkFolder from "../model/bulkfolder.model";
@Component({
  selector: "app-file-manager",
  templateUrl: "./file-manager.component.html",
  styleUrl: "./file-manager.component.scss",
})
export class FileManagerViewComponent {
  @Input() folders: FolderDto[] = [];
  @Input() assets: PaginatedListOfAssetDto = {};
  @Input() pathToRoot: PathToRootDto[] = [];
  @Input() trashedItems: TrashFolderAndFilesDto[] = [];
  @Input() storageStatusByAssetType: BucketStorageStatusByAssetTypeDto[] = [];
  @Input() folderTree: FolderDto[] = [];

  @Output() setCurrentFolderIdEvent = new EventEmitter<number>();
  @Output() trashFoldersEvent = new EventEmitter<number[]>();
  @Output() restoreItemsEvent = new EventEmitter<TrashFolderAndFilesDto[]>();
  @Output() addFolderEvent = new EventEmitter<string>();
  @Output() fileUploadEvent = new EventEmitter<File>();
  @Output() fetchTrashedItemsEvent = new EventEmitter();
  @Output() searchEvent = new EventEmitter<string>();
  @Output() trashAssetEvent = new EventEmitter<number>();
  @Output() assetListPageChangedEvent = new EventEmitter<PageChangedEvent>();

  // bread crumb items
  breadCrumbItems: Array<{}>;
  radialoptions: any;
  public isCollapsed: boolean = true;
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

  pinnedFolderList$: Observable<FolderDto[]>;

  selectedOption: string = "file";
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private store: Store,
    private route: ActivatedRoute
  ) {
    this.pinnedFolderList$ = store.select(selectPinnedFolders);
  }

  ngOnInit(): void {
    this.currentFolderId = this.route.snapshot.queryParams.folderId || null;
    this.breadCrumbItems = [
      { label: "Apps" },
      { label: "File Manager", active: true },
    ];

    this.store.dispatch(pinnedFolderList());

    this.showComponents(["folders", "assets"]);

    this.radialoptions = {
      series: [34],
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

  selectedFile: File[] = [];
  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = Array.from(input.files);
    }
  }

  folderStructure: BulkFolder;
  onFolderSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const fileList = Array.from(input.files);
      const tree = this.generateTreeStructure(fileList);
      this.folderStructure = tree;
    }
  }

  generateTreeStructure(files: File[]): BulkFolder {
    const root: Record<string, BulkFolder> = {};

    files.forEach((file) => {
      const parts = file.webkitRelativePath.split("/");
      let currentLevel = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        if (!currentLevel[part]) {
          currentLevel[part] = {
            name: part,
            type: isFile ? "file" : "folder",
            ...(isFile ? { files: file } : { children: [] }),
          };
        }

        if (!isFile) {
          currentLevel = currentLevel[part].children as unknown as Record<
            string,
            BulkFolder
          >;
        }
      });
    });

    return this.objectToArray(root);
  }

  objectToArray(obj: Record<string, BulkFolder>): BulkFolder {
    const [key, node] = Object.entries(obj)[0];

    if (!node) {
      throw new Error("Input object is empty or invalid.");
    }

    return {
      ...node,
      children: node.children
        ? Object.values(
            node.children as unknown as Record<string, BulkFolder>
          ).map((child) => this.objectToArray({ [child.name]: child }))
        : undefined,
    };
  }

  onUploadFiles() {
    if (this.selectedFile) {
      this.selectedFile.forEach((file) => {
        this.fileUploadEvent.emit(file);
      });
      this.modalRef?.hide();
    }
  }

  onUploadFolder() {
    this.currentFolderId = this.route.snapshot.queryParams.folderId || null;
    this.store.dispatch(
      uploadFolderWithFolderAndFiles({
        parentId: this.currentFolderId,
        folder: this.folderStructure,
      })
    );
    this.modalRef?.hide();
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

  restoreItems(items: TrashFolderAndFilesDto[]) {
    this.restoreItemsEvent.emit(items);
  }

  trashAsset($event: number) {
    this.trashAssetEvent.emit($event);
  }

  totalStorageUsed(
    storageStatusByAssetType: BucketStorageStatusByAssetTypeDto[]
  ) {
    return storageStatusByAssetType?.reduce((acc, curr) => acc + curr.size, 0);
  }

  assetListPageChanged($event: PageChangedEvent) {
    this.assetListPageChangedEvent.emit($event);
  }

  private hideAllComponents() {
    Object.keys(this.componentVisibilityStatus).forEach((key) => {
      this.componentVisibilityStatus[key] = false;
    });
  }
}
