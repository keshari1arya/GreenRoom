import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileManagerShellComponent } from "./file-manager-shell/file-manager-shell.component";
import { AssetDetailsComponent } from "./asset-details/asset-details.component";

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: FileManagerShellComponent,
  },
  {
    path: "asset/:id",
    component: AssetDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileManagerRoutingModule {}
