import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileManagerShellComponent } from "./file-manager-shell/file-manager-shell.component";
import { FileManagerViewComponent } from "./file-manager/file-manager.component";
import { FileManagerRoutingModule } from "./file-manager-routing.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertModule } from "ngx-bootstrap/alert";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { LightboxModule } from "ngx-lightbox";
import { SimplebarAngularModule } from "simplebar-angular";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { UIModule } from "../shared/ui/ui.module";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { FileManagerReducer } from "./store/file-manager.reducer";
import { EffectsModule } from "@ngrx/effects";
import { FileManagerEffects } from "./store/file-manager.effects";
import { AssetListComponent } from "./asset-list/asset-list.component";
import { FolderListComponent } from "./folder-list/folder-list.component";
import { TrashedItemsComponent } from "./trashed-items/trashed-items.component";
import { AssetDetailsComponent } from "./asset-details/asset-details.component";
import { TagInputModule } from "ngx-chips";
import { FileIconPipe } from "./shared/pipes/file-icon.pipe";
import { FileSizePipe } from "./shared/pipes/file-size.pipe";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { SubFolderComponent } from "./sub-folder/sub-folder.component";

@NgModule({
  declarations: [
    FileManagerShellComponent,
    FileManagerViewComponent,
    AssetListComponent,
    FolderListComponent,
    TrashedItemsComponent,
    AssetDetailsComponent,
    FileIconPipe,
    FileSizePipe,
    SubFolderComponent,
  ],
  imports: [
    CommonModule,
    FileManagerRoutingModule,
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    // PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    // DashboardsModule,
    UIModule,
    // WidgetModule,
    // FullCalendarModule,
    // TabsModule.forRoot(),
    // TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    AlertModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    // PickerModule,
    StoreModule.forFeature("fileManager", FileManagerReducer),
    EffectsModule.forFeature([FileManagerEffects]),
    NgxDocViewerModule,
    TagInputModule,
    // BrowserAnimationsModule,
    PaginationModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class FileManagerModule {}
