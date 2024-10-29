import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, finalize } from "rxjs";
import { LoaderService } from "../services/loader.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.showLoader();
    return next
      .handle(req)
      .pipe(finalize(() => this.loaderService.hideLoader()));
  }
}

export const loaderInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
];
