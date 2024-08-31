import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { AccessTokenResponse } from 'src/app/lib/openapi-generated/models';
import { UsersService } from 'src/app/lib/openapi-generated/services';

@Injectable({ providedIn: 'root' })
export default class AuthService {
  private ACCESS_TOKEN = 'accessToken';
  private REFRESH_TOKEN = 'refreshToken';
  private TOKEN_EXPIRES_AT = 'tokenExpiresAt';

  constructor(private userService: UsersService) {}
  login(username: string, password: string): void {
    this.userService
      .postApiUsersLogin({ body: { email: username, password: password } })
      .pipe(
        map((res) => {
          this.setAuthData(res);
        })
      )
      .subscribe();
  }

  refreshAccessToken(): void {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN);
    this.userService
      .postApiUsersRefresh({ body: { refreshToken: refreshToken! } })
      .pipe(
        map((res) => {
          this.setAuthData(res);
        })
      )
      .subscribe();
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.TOKEN_EXPIRES_AT);
  }

  getToken(): string | null {
    if (
      localStorage.getItem(this.TOKEN_EXPIRES_AT)! <
      new Date().getTime().toString()
    ) {
      this.refreshAccessToken();
    }
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  private setAuthData(res: AccessTokenResponse) {
    localStorage.setItem(this.ACCESS_TOKEN, res.accessToken!);
    localStorage.setItem(this.REFRESH_TOKEN, res.refreshToken!);
    const now = new Date();
    const expireDate = now.setSeconds(now.getSeconds() + res.expiresIn!);
    localStorage.setItem(this.TOKEN_EXPIRES_AT, expireDate.toString());
  }
}
