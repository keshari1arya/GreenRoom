import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  switchMap,
  map,
  catchError,
  of,
  tap,
  exhaustMap,
  concatMap,
} from "rxjs";
import { multitenantActions } from "./multitenant.actions";
import {
  TenantService,
  UsersService,
} from "src/app/lib/openapi-generated/services";
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

  searchUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.searchUsers),
      switchMap(({ searchTerm: searchTerm }) =>
        this.userService.searchUsers({ searchTerm }).pipe(
          map((users) => multitenantActions.searchUsersSuccess({ users })),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  addTenantUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.addUser),
      switchMap(({ user }) =>
        this.tenantService
          .addTenantUsers({ body: { usersWithRole: [user] } })
          .pipe(
            map((userId) => multitenantActions.addUserSuccess({ userId })),
            catchError((error) => of(multitenantActions.setError({ error })))
          )
      )
    )
  );

  updateTenantUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.updateRoleId),
      switchMap(({ userRole }) =>
        this.tenantService.updateRole({ body: userRole }).pipe(
          map((userId) => multitenantActions.updateRoleIdSuccess({ userId })),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  getTenantRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.getTenantRoles),
      switchMap(() =>
        this.tenantService.getRoles().pipe(
          map((userRole) =>
            multitenantActions.getTenantRolesSuccess({ userRole })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  fetchTenantList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.fetchMyTenantList),
      switchMap(() =>
        this.tenantService.myTenants().pipe(
          map((tenantList) =>
            multitenantActions.fetchMyTenantListSuccess({
              myTenantList: tenantList,
            })
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

  inviteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.inviteUser),
      switchMap(({ email, roleId }) =>
        this.tenantService
          .inviteUser({
            body: {
              email,
            },
          })
          .pipe(
            map(() => multitenantActions.inviteUserSuccess()),
            catchError((error) => of(multitenantActions.setError({ error })))
          )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private tenantService: TenantService,
    private router: Router,
    private userService: UsersService
  ) {}
}
