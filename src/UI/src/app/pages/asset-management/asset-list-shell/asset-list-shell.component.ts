import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FolderDto } from 'src/app/lib/openapi-generated/models';
import { Store } from '@ngrx/store';
import {
  assetManagementFeature,
  IAssetManagementState,
} from '../states/asset-management.feature';
import { assetManagementActions } from '../states/asset-management.actions';

@Component({
  selector: 'app-asset-list-shell',
  templateUrl: './asset-list-shell.component.html',
  styleUrl: './asset-list-shell.component.scss',
})
export class AssetListShellComponent implements OnInit {
  constructor(private store: Store<IAssetManagementState>) {
    this.folders$ = this.store.select(assetManagementFeature.selectFolders);
  }

  folders$: Observable<Array<FolderDto>> = of([]);
  ngOnInit(): void {
    this.store.dispatch(assetManagementActions.getFolders({ folderId: null }));
  }
}
