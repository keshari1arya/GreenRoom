import {Action, createReducer, on} from '@ngrx/store';
import {
  addFolder,
  addFolderFail,
  addFolderSuccess,
  fetchAssetsByFolderIdData,
  fetchAssetsByFolderIdFail,
  fetchAssetsByFolderIdSuccess,
  fetchFoldersByParentIdData,
  fetchFoldersByParentIdFail,
  fetchFoldersByParentIdSuccess,
  fetchRecentFilesData,
  fetchRecentFilesFail,
  fetchRecentFilesSuccess,
  pathToRoot,
  pathToRootSuccess,
} from './filemanager.actions';
import {AssetDto, FolderDto, PathToRootDto} from 'src/app/lib/openapi-generated/models';

export interface FileManagerState {
  loading: boolean;
  error: any;
  folders: FolderDto[];
  assets: AssetDto[];
  recentFiles: any[];
  pathToRoot: PathToRootDto[];
}

export const initialState: FileManagerState = {
  folders: [],
  recentFiles: [],
  loading: false,
  error: null,
  assets: [],
  pathToRoot: [],
};

export const FileManageReducer = createReducer(
  initialState,
  on(fetchRecentFilesData, (state) => {
    return {...state, loading: true, error: null};
  }),
  on(fetchRecentFilesSuccess, (state, {recentFiles}) => {
    return {...state, recentFiles, loading: false};
  }),
  on(fetchRecentFilesFail, (state, {error}) => {
    return {...state, error, loading: false};
  }),
  on(fetchFoldersByParentIdData, (state, param) => {
    return {...state, loading: true, error: null, currentFolderId: param.parentId};
  }),
  on(fetchFoldersByParentIdSuccess, (state, {folders}) => {
    return {...state, folders, loading: false};
  }),
  on(fetchFoldersByParentIdFail, (state, {error}) => {
    return {...state, error, loading: false};
  }),
  on(fetchAssetsByFolderIdData, (state) => {
    return {...state, loading: true, error: null};
  }),
  on(fetchAssetsByFolderIdSuccess, (state, {assets}) => {
    return {...state, assets, loading: false};
  }),
  on(fetchAssetsByFolderIdFail, (state, {error}) => {
    return {...state, error, loading: false};
  }),
  on(addFolder, (state) => {
    return {...state, loading: true, error: null};
  }),
  on(addFolderSuccess, (state) => {
    return {...state, loading: false};
  }),
  on(addFolderFail, (state, {error}) => {
    return {...state, error, loading: false};
  }),
  on(pathToRoot, (state) => {
    return {...state, loading: true, error: null};
  }),
  on(pathToRootSuccess, (state, {path}) => {
    return {...state, loading: false, pathToRoot: path};
  }),
);

// Selector
export function reducer(state: FileManagerState | undefined, action: Action) {
  return FileManageReducer(state, action);
}
