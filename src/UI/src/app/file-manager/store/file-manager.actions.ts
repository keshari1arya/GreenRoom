import { createAction, props } from "@ngrx/store";
import { FileManager } from "./file-manager.model";
import {
  AssetDto,
  FolderDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
} from "src/app/lib/openapi-generated/models";
import { CreateFolder$Params } from "src/app/lib/openapi-generated/fn/folders/create-folder";

// fetch
export const fetchRecentFilesData = createAction("[Data] fetch RecentFiles");
export const fetchRecentFilesSuccess = createAction(
  "[Data] fetch RecentFiles success",
  props<{ recentFiles: FileManager[] }>()
);
export const fetchRecentFilesFail = createAction(
  "[Data fetch RecentFiles failed]",
  props<{ error: string }>()
);

// fetch FoldersByParentId
export const fetchFoldersByParentIdData = createAction(
  "[Data] fetch FoldersByParentId",
  props<{ parentId: number | null }>()
);
export const fetchFoldersByParentIdSuccess = createAction(
  "[Data] fetch FoldersByParentId success",
  props<{ folders: FolderDto[] }>()
);
export const fetchFoldersByParentIdFail = createAction(
  "[Data fetch FoldersByParentId failed]",
  props<{ error: string }>()
);

// fetch AssetsByFolderId
export const fetchAssetsByFolderIdData = createAction(
  "[Data] fetch AssetsByFolderId",
  props<{ folderId: number | null }>()
);
export const fetchAssetsByFolderIdSuccess = createAction(
  "[Data] fetch AssetsByFolderId success",
  props<{ assets: AssetDto[] }>()
);
export const fetchAssetsByFolderIdFail = createAction(
  "[Data fetch AssetsByFolderId failed]",
  props<{ error: string }>()
);

// add Folder
export const addFolder = createAction(
  "[Data] add Folder",
  props<{ folder: CreateFolder$Params }>()
);
export const addFolderSuccess = createAction(
  "[Data] add Folder success",
  props<{ folderId: number }>()
);
export const addFolderFail = createAction(
  "[Data add Folder failed]",
  props<{ error: string }>()
);

// trash Folder
export const trashFolder = createAction(
  "[Data] trash Folder",
  props<{ folderId: number }>()
);
export const trashFolderSuccess = createAction("[Data] trash Folder success");
export const trashFolderFail = createAction(
  "[Data trash Folder failed]",
  props<{ error: string }>()
);

// Path to root
export const pathToRoot = createAction(
  "[Data] path to root",
  props<{ folderId?: number }>()
);
export const pathToRootSuccess = createAction(
  "[Data] path to root success",
  props<{ path: PathToRootDto[] }>()
);
export const pathToRootFail = createAction(
  "[Data path to root failed]",
  props<{ error: string }>()
);

export const fetchTrashedItems = createAction("[Data] fetch TrashedItems");
export const fetchTrashedItemsSuccess = createAction(
  "[Data] fetch TrashedItems success",
  props<{ trashedItems: TrashFolderAndFilesDto[] }>()
);
export const fetchTrashedItemsFail = createAction(
  "[Data fetch TrashedItems failed]",
  props<{ error: string }>()
);
