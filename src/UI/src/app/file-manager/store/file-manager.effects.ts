import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, mergeMap, map, concatMap } from "rxjs/operators";
import {
  addFolder,
  addFolderSuccess,
  addTag,
  fetchAssetDetails,
  fetchAssetDetailsSuccess,
  fetchAssetsByFolderIdData,
  fetchAssetsByFolderIdSuccess,
  fetchFoldersByParentIdData,
  fetchFoldersByParentIdSuccess,
  fetchTrashedItems,
  fetchTrashedItemsSuccess,
  pathToRoot,
  pathToRootSuccess,
  removeTag,
  restoreAssets,
  restoreFolders,
  restoreFolderSuccess,
  searchFoldersAndAssets,
  setError,
  trashAssets,
  trashFolder,
  trashFolderSuccess,
} from "./file-manager.actions";
import { of } from "rxjs";
import {
  AssetsService,
  FoldersService,
} from "src/app/lib/openapi-generated/services";

@Injectable()
export class FileManagerEffects {
  fetchFolders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchFoldersByParentIdData),
      mergeMap((param) =>
        this.folderService.getFolders({ FolderId: param.parentId }).pipe(
          map((folders) => fetchFoldersByParentIdSuccess({ folders })),
          catchError((error) => of(setError({ error })))
        )
      )
    )
  );

  fetchAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchAssetsByFolderIdData),
      mergeMap((param) =>
        this.assetsService.getAssets({ FolderId: param.folderId }).pipe(
          map((assets) => fetchAssetsByFolderIdSuccess({ assets })),
          catchError((error) => of(setError({ error })))
        )
      )
    )
  );

  createFolder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFolder),
      mergeMap((param) =>
        this.folderService.createFolder(param.folder).pipe(
          map((createdFolderId) => {
            addFolderSuccess({ folderId: createdFolderId });
            return fetchFoldersByParentIdData({
              parentId: param.folder.body.parentFolderId,
            });
          }),
          catchError((error) => of(setError({ error })))
        )
      )
    )
  );

  trashFolders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trashFolder),
      mergeMap((param) =>
        this.folderService.trashFolder({ body: { ids: param.folderIds } }).pipe(
          map(() => {
            trashFolderSuccess();
            return fetchFoldersByParentIdData({ parentId: null });
          }),
          catchError((error) => of(setError({ error })))
        )
      )
    )
  );

  restoreFolders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(restoreFolders),
      mergeMap((param) =>
        this.folderService
          .restoreFolder({ body: { ids: param.folderIds } })
          .pipe(
            concatMap(() => [restoreFolderSuccess(), fetchTrashedItems()]),
            catchError((error) => of(setError({ error })))
          )
      )
    )
  );

  trashAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trashAssets),
      mergeMap((param) =>
        this.assetsService
          .trashAssets({
            body: {
              ids: param.assetIds,
            },
          })
          .pipe(
            // TODO: Pass the folderId to fetchAssetsByFolderIdData
            map(() => fetchAssetsByFolderIdData({ folderId: null })),
            catchError((error) => of(setError({ error })))
          )
      )
    )
  );

  restoreAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(restoreAssets),
      mergeMap((param) =>
        this.assetsService
          .restoreAssets({
            body: {
              ids: param.assetIds,
            },
          })
          .pipe(
            map(() => fetchTrashedItems()),
            catchError((error) => of(setError({ error })))
          )
      )
    )
  );

  pathToRoot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(pathToRoot),
      mergeMap((param) =>
        this.folderService
          .getFolderPathToRoot({ folderId: param.folderId })
          .pipe(
            map((path) => {
              return pathToRootSuccess({ path });
            }),
            catchError((error) => {
              pathToRootSuccess({ path: [] });
              return of(setError({ error }));
            })
          )
      )
    )
  );

  fetchTrashedItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTrashedItems),
      mergeMap(() =>
        this.folderService.getTrashed().pipe(
          map((trashedItems) => fetchTrashedItemsSuccess({ trashedItems })),
          catchError((error) => of(setError({ error })))
        )
      )
    )
  );

  searchFolders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchFoldersAndAssets),
      mergeMap((param) =>
        this.folderService
          .searchFolders({
            folderId: param.parentId,
            searchTerm: param.searchQuery,
          })
          .pipe(
            map((folders) => {
              return fetchFoldersByParentIdSuccess({
                folders,
              });
            }),
            catchError((error) => of(setError({ error })))
          )
      )
    )
  );

  searchAssets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchFoldersAndAssets),
      mergeMap((param) =>
        this.assetsService
          .searchAssets({
            folderId: param.parentId,
            searchTerm: param.searchQuery,
          })
          .pipe(
            map((assets) => {
              return fetchAssetsByFolderIdSuccess({
                assets,
              });
            }),
            catchError((error) => of(setError({ error })))
          )
      )
    )
  );

  assetDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchAssetDetails),
      mergeMap((param) =>
        this.assetsService.getAssetDetails({ id: param.assetId }).pipe(
          map((asset) => fetchAssetDetailsSuccess({ assetDetails: asset })),
          catchError((error) => of(setError({ error })))
        )
      )
    )
  );

  addTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTag),
      mergeMap((param) =>
        this.assetsService
          .addTagToAsset({
            assetId: param.assetId,
            tag: param.tag,
          })
          .pipe(
            map(() => fetchAssetDetails({ assetId: param.assetId })),
            catchError((error) => of(setError({ error })))
          )
      )
    )
  );

  removeTag$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeTag),
      mergeMap((param) => {
        console.log(param);

        return this.assetsService
          .removeTagFromAsset({
            assetId: param.assetId,
            tag: param.tag,
          })
          .pipe(
            map(() => fetchAssetDetails({ assetId: param.assetId })),
            catchError((error) => of(setError({ error })))
          );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private folderService: FoldersService,
    private assetsService: AssetsService
  ) {}
}
