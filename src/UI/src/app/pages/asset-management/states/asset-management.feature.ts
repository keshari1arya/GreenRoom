import { createFeature, createReducer, on } from '@ngrx/store';
import { assetManagementActions } from './asset-management.actions';
import { FolderDto } from 'src/app/lib/openapi-generated/models';

export const ASSET_MANAGEMENT_STATE_NAME = 'assetManagementState';

export interface IAssetManagementState {
  currentFolderId: number | undefined | null;
  folders: FolderDto[];
  error: any | undefined | null;
}

export const initialState: IAssetManagementState = {
  folders: [],
  currentFolderId: undefined,
  error: undefined,
};

export const assetManagementReducer = createReducer(
  initialState,
  on(assetManagementActions.setCurrentFolderId, (state, { folderId }) => ({
    ...state,
    currentFolderId: folderId,
  })),
  on(assetManagementActions.setFolders, (state, { folders }) => ({
    ...state,
    folders,
  })),
  on(assetManagementActions.setError, (state, { error }) => ({
    ...state,
    error,
  }))
);

export const assetManagementFeature = createFeature({
  name: ASSET_MANAGEMENT_STATE_NAME,
  reducer: assetManagementReducer,
});
