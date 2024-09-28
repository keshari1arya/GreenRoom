import { Injectable, Inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, exhaustMap, tap, catchError, concatMap } from "rxjs/operators";
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { AuthActions } from "./authentication.actions";
import { TenantService } from "src/app/lib/openapi-generated/services";

@Injectable()
export class AuthenticationEffects {
  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password }) => {
        return this.authService.register(email, password).pipe(
          map((user) => {
            // TODO: Perform redirect outside of effects
            // this.router.navigate(["/auth/login"]);
            return AuthActions.registerSuccess();
          })
        );
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ email, password }) => {
        return this.authService.login(email, password).pipe(
          concatMap(() => {
            // TODO: Perform redirect outside of effects

            return [AuthActions.loginSuccess(), AuthActions.fetchMyTenants()];
          }),
          catchError((error) => {
            // TODO: Handle error in a more meaningful way
            if (error.status === 401) {
              return of(AuthActions.setError({ error: "Invalid credentials" }));
            }
            return of(AuthActions.setError({ error: "something went wrong" }));
          })
        );
      })
    )
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(() => {
          const returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
          this.router.navigateByUrl(returnUrl);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // TODO: Perform any necessary cleanup or side effects before logging out
        this.authService.logout();
      }),
      exhaustMap(() => of(AuthActions.logoutSuccess()))
    )
  );

  fetchMyTenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.fetchMyTenants),
      exhaustMap(() => {
        return this.tenantService.myTenants().pipe(
          map((tenants) => {
            // TODO: Handle case where user has no tenants or multiple tenants
            this.authService.setCurrentTenant(tenants[0].id);
            return AuthActions.fetchMyTenantsSuccess({ tenants });
          })
        );
      })
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private tenantService: TenantService
  ) {}
}
