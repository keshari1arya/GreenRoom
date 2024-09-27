import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

import { PagetitleComponent } from "./pagetitle/pagetitle.component";
import { LoaderComponent } from "./loader/loader.component";
import { ErrorMessageComponent } from "./error-message/error-message.component";
import { ControlValidationClassDirective } from "./directives/control-validation-class.directive";
@NgModule({
  declarations: [
    PagetitleComponent,
    LoaderComponent,
    ErrorMessageComponent,
    ControlValidationClassDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    PagetitleComponent,
    LoaderComponent,
    ErrorMessageComponent,
    ControlValidationClassDirective,
  ],
})
export class UIModule {}
