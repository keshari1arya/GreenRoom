import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error["status"] !== 401 && error["status"] !== 403) {
          return throwError(() => error);
        }
        return throwError(() => error);
      })
    );
  }
}
