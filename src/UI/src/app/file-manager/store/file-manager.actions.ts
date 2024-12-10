import { createAction, props } from "@ngrx/store";
import { FileManager } from "./file-manager.model";
import {
  AssetDetailsDto,
  AssetDto,
  BucketStorageStatusByAssetTypeDto,
  FolderDto,
  PaginatedListOfAssetDto,
  PathToRootDto,
  TrashFolderAndFilesDto,
} from "src/app/lib/openapi-generated/models";
import { CreateFolder$Params } from "src/app/lib/openapi-generated/fn/folders/create-folder";
import BulkFolder from "../model/bulkFolder.model";

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
  props<{ folderId: number | null; pageNumber?: number; pageSize?: number }>()
);
export const fetchAssetsByFolderIdSuccess = createAction(
  "[FileManager] fetch AssetsByFolderId success",
  props<{ assets: PaginatedListOfAssetDto }>()
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

export const searchFoldersAndAssets = createAction(
  "[FileManager] search Folders and Assets",
  props<{ searchQuery: string; parentId: number }>()
);

export const trashAssets = createAction(
  "[FileManager] trash Asset",
  props<{ assetIds: number[] }>()
);

export const restoreAssets = createAction(
  "[FileManager] restore Asset",
  props<{ assetIds: number[] }>()
);

export const fetchAssetDetails = createAction(
  "[FileManager] fetch Asset Details",
  props<{ assetId: number }>()
);

export const fetchAssetDetailsSuccess = createAction(
  "[FileManager] fetch Asset Details success",
  props<{ assetDetails: AssetDetailsDto }>()
);

export const clearAssetDetails = createAction(
  "[FileManager] clear Asset Details"
);

export const addTag = createAction(
  "[FileManager] Add Tag",
  props<{ assetId: number; tag: string }>()
);

export const removeTag = createAction(
  "[FileManager] Remove Tag",
  props<{ assetId: number; tag: string }>()
);

export const pinnedFolderList = createAction("[FileManager] Folder List");

export const pinnedFolderListSuccess = createAction(
  "[FileManager] Folder List success",
  props<{ pinnedFolders: FolderDto[] }>()
);

export const togglePinnedFolder = createAction(
  "[FileManager] Toggle Pinned Folder",
  props<{ folderId: number }>()
);

export const fetchTotalOccupiedStorage = createAction(
  "[FileManager] fetch Total Occupied Storage"
);

export const fetchTotalOccupiedStorageSuccess = createAction(
  "[FileManager] fetch Total Occupied Storage success",
  props<{ totalOccupiedStorage: number }>()
);

export const fetchStorageStatusByAssetType = createAction(
  "[FileManager] fetch Storage Status By Asset Type"
);

export const fetchStorageStatusByAssetTypeSuccess = createAction(
  "[FileManager] fetch Storage Status By Asset Type success",
  props<{ storageStatusByAssetType: BucketStorageStatusByAssetTypeDto[] }>()
);

export const fetchFolderTree = createAction(
  "[FileManager] fetch Structured Folders"
);

export const fetchFolderTreeSuccess = createAction(
  "[FileManager] fetch Structured Folders success",
  props<{ folderTree: FolderDto[] }>()
);

export const uploadFolderWithFolderAndFiles = createAction(
  "[FileManager] upload Folder with Folder and Files",
  props<{ parentId: number; folder: BulkFolder }>()
);
