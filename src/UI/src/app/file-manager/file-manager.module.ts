import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FileManagerShellComponent } from "./file-manager-shell/file-manager-shell.component";
import { FileManagerViewComponent } from "./file-manager-view/file-manager-view.component";
import { FileManagerRoutingModule } from "./file-manager-routing.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AlertModule } from "ngx-bootstrap/alert";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { LightboxModule } from "ngx-lightbox";
import { SimplebarAngularModule } from "simplebar-angular";
import { UIModule } from "../shared/ui/ui.module";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { FileManagerReducer } from "./store/file-manager.reducer";
import { EffectsModule } from "@ngrx/effects";
import { FileManagerEffects } from "./store/file-manager.effects";

@NgModule({
  declarations: [FileManagerShellComponent, FileManagerViewComponent],
  imports: [CommonModule, FileManagerRoutingModule,
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
    StoreModule.forFeature('fileManager', FileManagerReducer),
    EffectsModule.forFeature([FileManagerEffects]),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class FileManagerModule {}
