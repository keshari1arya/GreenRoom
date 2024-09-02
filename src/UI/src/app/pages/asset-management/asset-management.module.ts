import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetManagementRoutes } from './asset-management.routing';
import { AssetListComponent } from './asset-list/asset-list.component';
import { MaterialModule } from 'src/app/material.module';
import { AssetListShellComponent } from './asset-list-shell/asset-list-shell.component';

@NgModule({
  declarations: [AssetListComponent, AssetListShellComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(AssetManagementRoutes),
  ],
})
export class AssetManagementModule {}
