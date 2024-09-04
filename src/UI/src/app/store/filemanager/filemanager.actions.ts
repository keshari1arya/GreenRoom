import { createAction, props } from '@ngrx/store';
import { Filemanager } from './filemanager.model';
import { AssetDto, FolderDto } from 'src/app/lib/openapi-generated/models';

// fetch 
export const fetchRecentFilesData = createAction('[Data] fetch RecentFiles');
export const fetchRecentFilesSuccess = createAction('[Data] fetch RecentFiles success', props<{ recentFiles: Filemanager[] }>())
export const fetchRecentFilesFail = createAction('[Data fetch RecentFiles failed]', props<{ error: string }>())

// fetch FoldersByParentId
export const fetchFoldersByParentIdData = createAction('[Data] fetch FoldersByParentId', props<{ parentId: number | null }>());
export const fetchFoldersByParentIdSuccess = createAction('[Data] fetch FoldersByParentId success', props<{ folders: FolderDto[] }>())
export const fetchFoldersByParentIdFail = createAction('[Data fetch FoldersByParentId failed]', props<{ error: string }>())

// fetch AssetsByFolderId
export const fetchAssetsByFolderIdData = createAction('[Data] fetch AssetsByFolderId', props<{ folderId: number | null }>());
export const fetchAssetsByFolderIdSuccess = createAction('[Data] fetch AssetsByFolderId success', props<{ assets: AssetDto[] }>())
export const fetchAssetsByFolderIdFail = createAction('[Data fetch AssetsByFolderId failed]', props<{ error: string }>())