import { createAction, props } from '@ngrx/store';
import { FolderDto } from 'src/app/lib/openapi-generated/models';

const setCurrentFolderId = createAction(
  '[Asset Management] Set Current Folder Id',
  props<{ folderId: number | undefined }>()
);

const getFolders = createAction(
  '[Asset Management] Get Folders by Parent Folder Id',
  props<{ folderId: number | undefined | null }>()
);
const setFolders = createAction(
  '[Asset Management] Set Folders',
  props<{ folders: FolderDto[] }>()
);

const setError = createAction(
  '[Asset Management] Set Error',
  props<{ error: any }>()
);

export const assetManagementActions = {
  setCurrentFolderId,
  getFolders,
  setFolders,
  setError,
};
