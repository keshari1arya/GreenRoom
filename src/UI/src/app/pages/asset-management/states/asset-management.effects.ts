import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FoldersService } from 'src/app/lib/openapi-generated/services';
import { assetManagementActions } from './asset-management.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class AssetManagementEffects {
  constructor(
    private actions$: Actions,
    private folderService: FoldersService
  ) {}

  loadFoldersById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assetManagementActions.getFolders),
      switchMap((params) =>
        this.folderService.getFolders({ FolderId: params.folderId }).pipe(
          map((folders) => assetManagementActions.setFolders({ folders })),
          catchError((error) => of(assetManagementActions.setError({ error })))
        )
      )
    )
  );
}
