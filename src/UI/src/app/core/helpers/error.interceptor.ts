import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { UsersService } from "src/app/lib/openapi-generated/services";
import { AccessTokenResponse } from "src/app/lib/openapi-generated/models";
import { Router } from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private route: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.userService
        .postApiUsersRefresh({
          // TODO: Use the refresh token from the token storage service
          body: { refreshToken: this.authService.getRefreshToken() },
        })
        .pipe(
          switchMap((tokenResponse) => {
            this.isRefreshing = false;
            this.authService.setAuthData(tokenResponse);
            this.refreshTokenSubject.next(tokenResponse);
            return next.handle(this.addToken(request, tokenResponse));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authService.logout();
            const returnUrl = this.route.url;
            this.route.navigate(["/auth/login"], {
              queryParams: { returnUrl },
            });
            return throwError(() => err);
          })
        );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private addToken(request: HttpRequest<any>, response: AccessTokenResponse) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${response.accessToken}`,
      },
    });
  }
}
