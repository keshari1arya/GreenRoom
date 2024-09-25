import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { TenantDetailsComponent } from "./tenant-details/tenant-details.component";
import { PaymentHistoryComponent } from "./payment-history/payment-history.component";
import { UserManagerComponent } from "./user-manager/user-manager.component";

const routes: Routes = [
  {
    path: "",
    component: TenantDetailsComponent,
  },
  {
    path: "details",
    component: TenantDetailsComponent,
  },
  {
    path: "payment-history",
    component: PaymentHistoryComponent,
  },
  {
    path: "user-manager",
    component: UserManagerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MultitenantRoutingModule {}
