import { createAction, props } from "@ngrx/store";
import { FileManager } from "./file-manager.model";
import {
  AssetDto,
  FolderDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
} from "src/app/lib/openapi-generated/models";
import { CreateFolder$Params } from "src/app/lib/openapi-generated/fn/folders/create-folder";

// set error
export const setError = createAction(
  "[FileManager] set error",
  props<{ error: any }>()
);

// fetch
export const fetchRecentFilesData = createAction(
  "[FileManager] fetch RecentFiles"
);
export const fetchRecentFilesSuccess = createAction(
  "[FileManager] fetch RecentFiles success",
  props<{ recentFiles: FileManager[] }>()
);

// fetch FoldersByParentId
export const fetchFoldersByParentIdData = createAction(
  "[FileManager] fetch FoldersByParentId",
  props<{ parentId: number | null }>()
);
export const fetchFoldersByParentIdSuccess = createAction(
  "[FileManager] fetch FoldersByParentId success",
  props<{ folders: FolderDto[] }>()
);

// fetch AssetsByFolderId
export const fetchAssetsByFolderIdData = createAction(
  "[FileManager] fetch AssetsByFolderId",
  props<{ folderId: number | null }>()
);
export const fetchAssetsByFolderIdSuccess = createAction(
  "[FileManager] fetch AssetsByFolderId success",
  props<{ assets: AssetDto[] }>()
);

// add Folder
export const addFolder = createAction(
  "[FileManager] add Folder",
  props<{ folder: CreateFolder$Params }>()
);
export const addFolderSuccess = createAction(
  "[FileManager] add Folder success",
  props<{ folderId: number }>()
);

// trash Folder
export const trashFolder = createAction(
  "[FileManager] trash Folder",
  props<{ folderIds: number[] }>()
);
export const trashFolderSuccess = createAction(
  "[FileManager] trash Folder success"
);

// restore folder from trash
export const restoreFolders = createAction(
  "[FileManager] restore Folders",
  props<{ folderIds: number[] }>()
);
export const restoreFolderSuccess = createAction(
  "[FileManager] restore Folders success"
);

// Path to root
export const pathToRoot = createAction(
  "[FileManager] path to root",
  props<{ folderId?: number }>()
);
export const pathToRootSuccess = createAction(
  "[FileManager] path to root success",
  props<{ path: PathToRootDto[] }>()
);

export const fetchTrashedItems = createAction(
  "[FileManager] fetch TrashedItems"
);
export const fetchTrashedItemsSuccess = createAction(
  "[FileManager] fetch TrashedItems success",
  props<{ trashedItems: TrashFolderAndFilesDto[] }>()
);