import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssetManagementRoutes } from './asset-management.routing';
import { AssetListComponent } from './asset-list/asset-list.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [AssetListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(AssetManagementRoutes),
  ],
})
export class AssetManagementModule {}
