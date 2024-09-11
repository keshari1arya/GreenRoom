import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FileManagerShellComponent } from "./file-manager-shell/file-manager-shell.component";

const routes: Routes = [
    // { path: '', redirectTo: 'dashboard' },
    {
      path: "",
      component: FileManagerShellComponent
    },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class FileManagerRoutingModule { }
