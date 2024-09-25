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
import { MULTITENANT_TEATURE_NAME } from "./store/multitenant.selector";

@NgModule({
  declarations: [
    TenantDetailsComponent,
    UserManagerComponent,
    PaymentHistoryComponent,
  ],
  imports: [
    CommonModule,
    MultitenantRoutingModule,
    UIModule,
    StoreModule.forFeature(MULTITENANT_TEATURE_NAME, MultitenantReducer),

    EffectsModule.forFeature([MultitenantEffects]),
  ],
})
export class MultitenantModule {}
