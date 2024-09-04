import { Action, createReducer, on } from '@ngrx/store';
import { fetchAssetsByFolderIdData, fetchAssetsByFolderIdFail, fetchAssetsByFolderIdSuccess, fetchFoldersByParentIdData, fetchFoldersByParentIdFail, fetchFoldersByParentIdSuccess, fetchRecentFilesData, fetchRecentFilesFail, fetchRecentFilesSuccess } from './filemanager.actions';
import { AssetDto, FolderDto } from 'src/app/lib/openapi-generated/models';


export interface FilemanagerState {
    folders: FolderDto[];
    assets: AssetDto[];
    recentFiles: any[];
    loading: boolean;
    error: any;
}

export const initialState: FilemanagerState = {
    folders: [],
    recentFiles: [],
    loading: false,
    error: null,
    assets: []
};

export const FilemanageReducer = createReducer(
    initialState,
    on(fetchRecentFilesData, (state) => {
        return { ...state, loading: true, error: null };
    }),
    on(fetchRecentFilesSuccess, (state, { recentFiles }) => {
        return { ...state, recentFiles, loading: false };
    }),
    on(fetchRecentFilesFail, (state, { error }) => {
        return { ...state, error, loading: false };
    }),
    on(fetchFoldersByParentIdData, (state) => {
        return { ...state, loading: true, error: null };
    }),
    on(fetchFoldersByParentIdSuccess, (state, { folders }) => {
        return { ...state, folders, loading: false };
    }),
    on(fetchFoldersByParentIdFail, (state, { error }) => {
        return { ...state, error, loading: false };
    }),
    on(fetchAssetsByFolderIdData, (state) => {
        return { ...state, loading: true, error: null };
    }),
    on(fetchAssetsByFolderIdSuccess, (state, { assets }) => {
        return { ...state, assets, loading: false };
    }),
    on(fetchAssetsByFolderIdFail, (state, { error }) => {
        return { ...state, error, loading: false };
    })
);

// Selector
export function reducer(state: FilemanagerState | undefined, action: Action) {
    return FilemanageReducer(state, action);
}
