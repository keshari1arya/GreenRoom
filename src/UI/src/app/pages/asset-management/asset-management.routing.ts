import { Routes } from '@angular/router';
import { AssetListComponent } from './asset-list/asset-list.component';

export const AssetManagementRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AssetListComponent,
      },
    ],
  },
];
