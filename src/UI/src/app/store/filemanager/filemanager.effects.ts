import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, mergeMap, map } from "rxjs/operators";
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
    trashFolder,
    trashFolderFail,
    trashFolderSuccess,
} from "./filemanager.actions";
import { of } from "rxjs";
import { CrudService } from "src/app/core/services/crud.service";
import { AssetsService, FoldersService } from "src/app/lib/openapi-generated/services";

@Injectable()
export class FilemanagerEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchRecentFilesData),
            mergeMap(() =>
                this.CrudService.fetchData("/app/recentFiles").pipe(
                    map((recentFiles) => fetchRecentFilesSuccess({ recentFiles })),
                    catchError((error) => of(fetchRecentFilesFail({ error })))
                )
            )
        )
    );

    fetchFolders$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchFoldersByParentIdData),
            mergeMap((param) =>
                this.folderService.getFolders({ FolderId: param.parentId }).pipe(
                    map((folders) => fetchFoldersByParentIdSuccess({ folders })),
                    catchError((error) => of(fetchFoldersByParentIdFail({ error })))
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
                    catchError((error) => of(fetchAssetsByFolderIdFail({ error })))
                )
            )
        )
    );

    createFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addFolder),
            mergeMap((param) =>
                this.folderService.createFolder(param.folder).pipe(
                    map((folderId) => {
                        addFolderSuccess({ folderId });
                        return fetchFoldersByParentIdData({ parentId: null });
                    }),
                    catchError((error) => of(addFolderFail({ error })))
                )
            )
        )
    );

    deleteFolder$ = createEffect(() =>
        this.actions$.pipe(
            ofType(trashFolder),
            mergeMap((param) =>
                this.folderService.trashFolder({ body: { ids: [param.folderId] } }).pipe(
                    map(() => {
                        trashFolderSuccess();
                        return fetchFoldersByParentIdData({ parentId: null });
                    }),
                    catchError((error) => of(trashFolderFail({ error })))
                )
            )
        )
    );

    constructor(private actions$: Actions,
        private CrudService: CrudService,
        private folderService: FoldersService,
        private assetsService: AssetsService) { }
}
