import { Routes } from '@angular/router';
import { AssetListShellComponent } from './asset-list-shell/asset-list-shell.component';

export const AssetManagementRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AssetListShellComponent,
      },
    ],
  },
];
