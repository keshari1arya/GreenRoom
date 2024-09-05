import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FileManagerState} from './filemanager.reducer';

export const selectDataState = createFeatureSelector<FileManagerState>('Filelist');

export const selectData = createSelector(
  selectDataState,
  (state: FileManagerState) => state.recentFiles,
);

export const selectDataLoading = createSelector(
  selectDataState,
  (state: FileManagerState) => state.loading,
);

export const selectDataError = createSelector(
  selectDataState,
  (state: FileManagerState) => state.error,
);

export const selectFolders = createSelector(
  selectDataState,
  (state: FileManagerState) => state.folders,
);

export const selectAssets = createSelector(
  selectDataState,
  (state: FileManagerState) => state.assets,
);

export const selectPathToRoot = createSelector(
  selectDataState,
  (state: FileManagerState) => state.pathToRoot,
);
