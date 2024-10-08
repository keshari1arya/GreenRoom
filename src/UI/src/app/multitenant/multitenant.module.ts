import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MultitenantRoutingModule } from "./multitenant-routing.module";
import { UIModule } from "../shared/ui/ui.module";
import { UserManagerComponent } from "./user-manager/user-manager.component";
import { PaymentHistoryComponent } from "./payment-history/payment-history.component";
import { TenantDetailsComponent } from "./tenant-details/tenant-details.component";
import { EffectsModule } from "@ngrx/effects";
import { MultitenantEffects } from "./store/multitenant.effects";
import { StoreModule } from "@ngrx/store";
import { MultitenantReducer } from "./store/multitenant.reducer";
import { MULTITENANT_FEATURE_NAME } from "./store/multitenant.selector";
import { EditTenantComponent } from "./edit-tenant/edit-tenant.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
  declarations: [
    TenantDetailsComponent,
    UserManagerComponent,
    PaymentHistoryComponent,
    EditTenantComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    CommonModule,
    MultitenantRoutingModule,
    UIModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(MULTITENANT_FEATURE_NAME, MultitenantReducer),
    EffectsModule.forFeature([MultitenantEffects]),
  ],
})
export class MultitenantModule { }
