import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of, tap, take, exhaustMap } from "rxjs";
import { multitenantActions } from "./multitenant.actions";
import { TenantService, UsersService } from "src/app/lib/openapi-generated/services";
import { Router } from "@angular/router";
import { add } from "ngx-bootstrap/chronos";

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
            exhaustMap((createdTenantId) =>
              of(
                multitenantActions.createTenantSuccess({
                  tenantId: createdTenantId,
                })
              )
            ),
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

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.searchUsers),
      switchMap(({ searchTerm: searchTerm }) =>
        this.userService.searchUsers({ searchTerm }).pipe(
          map((users) =>
            multitenantActions.searchUsersSuccess({ users })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  addTenantUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.addUser),
      switchMap(({ user }) =>
        this.tenantService.addTenantUsers({ body: { usersWithRole: [user] } }).pipe(
          map((userId) =>
            multitenantActions.addUserSuccess({ userId })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  editTenantUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.editRoleId),
      switchMap(({ userRole }) =>
        this.tenantService
          .updateRole({ body: userRole })
          .pipe(
            map((userId) =>
              multitenantActions.editRoleIdSuccess({ userId })
            ),
            catchError((error) => of(multitenantActions.setError({ error })))
          )
      )
    )
  );

  getTenantRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.getRoleId),
      switchMap(() =>
        this.tenantService.getRoles().pipe(
          map((userRole) =>
            multitenantActions.getRoleIdSuccess({ userRole })
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
    private router: Router,
    private userService: UsersService,
  ) { }
}
