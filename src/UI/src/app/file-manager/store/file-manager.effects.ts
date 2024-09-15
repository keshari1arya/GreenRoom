import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, mergeMap, map, concatMap } from "rxjs/operators";
import {
  addFolder,
  addFolderSuccess,
  fetchAssetsByFolderIdData,
  fetchAssetsByFolderIdSuccess,
  fetchFoldersByParentIdData,
  fetchFoldersByParentIdSuccess,
  fetchTrashedItems,
  fetchTrashedItemsSuccess,
  pathToRoot,
  pathToRootSuccess,
  restoreFolders,
  restoreFolderSuccess,
  setError,
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

  constructor(
    private actions$: Actions,
    private folderService: FoldersService,
    private assetsService: AssetsService
  ) {}
}
