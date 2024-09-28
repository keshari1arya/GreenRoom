import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // TODO: if the request is not an API request, then do not add the token and tenantId
    if (!request.url.startsWith("/api")) {
      return next.handle(request);
    }
    // add authorization header with jwt token if available
    let token = this.authenticationService.token();
    let tenantId = this.authenticationService.tenantId();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          "X-Tenant-Id": `${tenantId}`,
        },
      });
    }
    return next.handle(request);
  }
}
