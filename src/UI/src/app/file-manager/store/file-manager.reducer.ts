import { Action, createReducer, on } from "@ngrx/store";
import {
  addFolder,
  addFolderSuccess,
  clearAssetDetails,
  fetchAssetDetails,
  fetchAssetDetailsSuccess,
  fetchAssetsByFolderIdData,
  fetchAssetsByFolderIdSuccess,
  fetchFoldersByParentIdData,
  fetchFoldersByParentIdSuccess,
  fetchRecentFilesData,
  fetchRecentFilesSuccess,
  fetchTrashedItemsSuccess,
  pinnedFolderListSuccess,
  pathToRoot,
  pathToRootSuccess,
  restoreFolderSuccess,
  setError,
  fetchTotalOccupiedStorageSuccess,
  fetchStorageStatusByAssetType,
  fetchStorageStatusByAssetTypeSuccess,
  fetchFolderTreeSuccess,
} from "./file-manager.actions";
import {
  AssetDetailsDto,
  AssetDto,
  BucketStorageStatusByAssetTypeDto,
  FolderDto,
  PaginatedListOfAssetDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
} from "src/app/lib/openapi-generated/models";

export interface FileManagerState {
  loading: boolean;
  error: any;
  folders: FolderDto[];
  assets: PaginatedListOfAssetDto;
  pathToRoot: PathToRootDto[];
  trashedItems: TrashFolderAndFilesDto[];
  assetDetails: AssetDetailsDto;
  pinnedFolders: FolderDto[];
  totalOccupiedStorage: number;
  storageStatusByAssetType: BucketStorageStatusByAssetTypeDto[];
  folderTree: FolderDto[];
}

export const initialState: FileManagerState = {
  folders: [],
  loading: false,
  error: null,
  assets: {},
  pathToRoot: [],
  trashedItems: [],
  assetDetails: {},
  pinnedFolders: [],
  totalOccupiedStorage: 0,
  storageStatusByAssetType: [],
  folderTree: [],
};

export const FileManagerReducer = createReducer(
  initialState,
  on(setError, (state, { error }) => {
    return { ...state, error, loading: false };
  }),
  on(fetchFoldersByParentIdData, (state, param) => {
    return {
      ...state,
      loading: true,
      error: null,
      currentFolderId: param.parentId,
    };
  }),
  on(fetchFoldersByParentIdSuccess, (state, { folders }) => {
    return { ...state, folders, loading: false };
  }),
  on(fetchAssetsByFolderIdData, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(fetchAssetsByFolderIdSuccess, (state, { assets }) => {
    return { ...state, assets, loading: false };
  }),
  on(addFolder, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(addFolderSuccess, (state) => {
    return { ...state, loading: false };
  }),
  on(pathToRoot, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(pathToRootSuccess, (state, { path }) => {
    return { ...state, loading: false, pathToRoot: path };
  }),
  on(fetchTrashedItemsSuccess, (state, { trashedItems }) => {
    return { ...state, trashedItems, loading: false };
  }),
  on(fetchRecentFilesSuccess, (state, { recentFiles }) => {
    return { ...state, recentFiles, loading: false };
  }),
  on(restoreFolderSuccess, (state) => {
    return { ...state, loading: false };
  }),
  on(fetchAssetDetails, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(fetchAssetDetailsSuccess, (state, { assetDetails }) => {
    return { ...state, assetDetails, loading: false };
  }),
  on(clearAssetDetails, (state) => {
    return { ...state, assetDetails: {} };
  }),
  on(pinnedFolderListSuccess, (state, { pinnedFolders }) => {
    return { ...state, pinnedFolders, loading: false };
  }),
  on(fetchTotalOccupiedStorageSuccess, (state, { totalOccupiedStorage }) => {
    return { ...state, totalOccupiedStorage, loading: false };
  }),
  on(
    fetchStorageStatusByAssetTypeSuccess,
    (state, { storageStatusByAssetType }) => {
      return { ...state, storageStatusByAssetType, loading: false };
    }
  ),
  on(fetchFolderTreeSuccess, (state, { folderTree }) => {
    return { ...state, folderTree, loading: false };
  })
);

// Selector
export function reducer(state: FileManagerState | undefined, action: Action) {
  return FileManagerReducer(state, action);
}
