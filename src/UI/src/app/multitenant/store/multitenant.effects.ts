import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  switchMap,
  map,
  catchError,
  of,
  tap,
  take,
  exhaustMap,
  concatMap,
} from "rxjs";
import { multitenantActions } from "./multitenant.actions";
import { TenantService } from "src/app/lib/openapi-generated/services";
import { Router } from "@angular/router";
import { AuthActions } from "src/app/account/auth/store/authentication.actions";

@Injectable()
export class MultitenantEffects {
  fetchTenantDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.fetchCurrentTenantDetails),
      switchMap(() =>
        this.tenantService.getCurrentTenant().pipe(
          map((tenantDetails) =>
            multitenantActions.fetchCurrentTenantDetailsSuccess({
              tenant: tenantDetails,
            })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  fetchTenantById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.fetchTenantById),
      switchMap(({ tenantId }) =>
        this.tenantService.getTenantDetails({ id: tenantId }).pipe(
          map((tenantDetails) =>
            multitenantActions.fetchTenantByIdSuccess({ tenant: tenantDetails })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  createTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.createTenant),
      switchMap(({ tenant }) =>
        this.tenantService
          .createTenant({
            body: tenant,
          })
          .pipe(
            concatMap((createdTenantId) => {
              return [
                multitenantActions.createTenantSuccess({
                  tenantId: createdTenantId,
                }),
                AuthActions.fetchMyTenants(),
              ];
            }),
            catchError((error) => of(multitenantActions.setError({ error })))
          )
      )
    )
  );

  fetchTenantUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.fetchTenantUsers),
      switchMap(() =>
        this.tenantService.getUsersForTenant().pipe(
          map((tenantUsers) =>
            multitenantActions.fetchTenantUsersSuccess({ tenantUsers })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  updateTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.updateTenant),
      switchMap(({ tenant }) =>
        this.tenantService
          .updateTenant({
            body: tenant,
            id: tenant.id,
          })
          .pipe(
            exhaustMap(() =>
              of(
                multitenantActions.updateTenantSuccess({
                  tenantId: tenant.id,
                })
              )
            ),
            catchError((error) => of(multitenantActions.setError({ error })))
          )
      )
    )
  );

  createdOrUpdatedTenant$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          multitenantActions.createTenantSuccess,
          multitenantActions.updateTenantSuccess
        ),
        // take(1),
        tap(({ tenantId }) => {
          this.router.navigate(["/multitenant", tenantId]);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private tenantService: TenantService,
    private router: Router
  ) {}
}
