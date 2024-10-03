import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuthGuard } from "./core/guards/auth.guard";
import { LayoutComponent } from "./layouts/layout.component";
import { CyptolandingComponent } from "./cyptolanding/cyptolanding.component";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "",
    component: LayoutComponent,
    loadChildren: () =>
      import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "pages",
    loadChildren: () =>
      import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule),
    canActivate: [AuthGuard],
  },
  { path: "crypto-ico-landing", component: CyptolandingComponent },
  {
    path: "file-manager",
    component: LayoutComponent,
    loadChildren: () =>
      import("./file-manager/file-manager.module").then(
        (m) => m.FileManagerModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "multitenant",
    component: LayoutComponent,
    loadChildren: () =>
      import("./multitenant/multitenant.module").then(
        (m) => m.MultitenantModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'subscription',
    component: LayoutComponent,
    loadChildren: () =>
      import('./subscription/subscription.module').then(
        m => m.SubscriptionModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: "top" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
