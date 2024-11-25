import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FileManagerState } from "./file-manager.reducer";

export const selectFileManagerState =
  createFeatureSelector<FileManagerState>("fileManager");

export const selectDataLoading = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.loading
);

export const selectDataError = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.error
);

export const selectFolders = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.folders
);

export const selectAssets = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.assets
);

export const selectPathToRoot = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.pathToRoot
);

export const selectTrashedItems = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.trashedItems
);

export const selectAssetDetails = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.assetDetails
);

export const selectPinnedFolders = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.pinnedFolders
);

export const selectTotalOccupiedStorage = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.totalOccupiedStorage
);

export const selectStorageStatusByAssetType = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.storageStatusByAssetType
);

export const selectTreeFolders = createSelector(
  selectFileManagerState,
  (state: FileManagerState) => state.structuredFolders
)