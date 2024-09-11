import { Injectable, Inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, catchError, exhaustMap, tap } from "rxjs/operators";
import { of } from "rxjs";
import { AuthenticationService } from "../../core/services/auth.service";
import {
  login,
  loginSuccess,
  logout,
  logoutSuccess,
  Register,
  RegisterSuccess,
  RegisterFailure,
} from "./authentication.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { UserProfileService } from "src/app/core/services/user.service";
import { User } from "./auth.models";

@Injectable()
export class AuthenticationEffects {
  Register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Register),
      exhaustMap(({ email, username, password }) => {
        return this.AuthenticationService.register({
          email,
          username,
          password,
        }).pipe(
          map((user) => {
            this.router.navigate(["/auth/login"]);

            // TODO: Remove this when the backend is ready
            const userTemp = new User();
            return RegisterSuccess({ user: userTemp });
          })
        );
      })
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ email, password }) => {
        return this.AuthenticationService.login(email, password).pipe(
          map((user) => {
            const returnUrl =
              this.route.snapshot.queryParams["returnUrl"] || "/";
            this.router.navigateByUrl(returnUrl);
            const userTemp = new User();
            return loginSuccess({ user: userTemp });
          })
        );
      })
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => {
        // Perform any necessary cleanup or side effects before logging out
      }),
      exhaustMap(() => of(logoutSuccess()))
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    private AuthenticationService: AuthenticationService,
    private userService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
}
