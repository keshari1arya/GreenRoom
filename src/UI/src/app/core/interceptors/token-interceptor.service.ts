import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import AuthService from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getToken();

    if (accessToken) {
      const authReq = this.addToken(req, accessToken);
      return next.handle(authReq).pipe(
        catchError((err) => {
          if (err.status === 401 && accessToken) {
            return this.handleTokenExpired(authReq, next);
          }
          throw err;
        })
      );
    } else {
      return next.handle(req);
    }
  }

  private addToken(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  private handleTokenExpired(request: HttpRequest<any>, next: HttpHandler) {
    this.authService.refreshAccessToken();
    return next.handle(request);
  }
}
