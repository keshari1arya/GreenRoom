import { Injectable } from "@angular/core";

import { catchError, from, map, of } from "rxjs";
import { UsersService } from "src/app/lib/openapi-generated/services";
import { AccessTokenResponse } from "src/app/lib/openapi-generated/models";
import { TokenStorageService } from "./token-storage.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenStorageService
  ) {}

  /**
   * Returns the current user
   */
  public token(): string {
    if (
      !localStorage.getItem("expiresIn") ||
      localStorage.getItem("expiresIn") < new Date().getTime().toString()
    ) {
      this.refreshToken();
    }
    return localStorage.getItem("token");
  }

  /**
   * Performs the auth
   * @param email email of user
   * @param password password of user
   */
  login(email: string, password: string) {
    return from(
      this.usersService
        .postApiUsersLogin({ body: { email: email, password: password } })
        .pipe(
          map((response) => {
            this.setAuthData(response);

            return response;
          })
        )
    );
  }

  /**
   * Performs the register
   * @param email email
   * @param password password
   */
  register(email: string, password: string) {
    // return from(getFirebaseBackend().registerUser(user));

    return from(
      this.usersService.postApiUsersRegister({
        body: {
          email,
          password,
        },
      })
    );
  }

  /**
   * forgot password to trigger the reset password mail
   * @param email email
   */
  forgotPassword(email: string) {
    return this.usersService.postApiUsersForgotPassword({
      body: {
        email,
      },
    });
  }

  /**
   * Reset the password
   * @param email email
   * @param newPassword new password
   * @param resetCode reset code
   */
  resetPassword(email: string, newPassword: string, resetCode: string) {
    return this.usersService
      .postApiUsersResetPassword({
        body: {
          email,
          newPassword,
          resetCode,
        },
      })
      .pipe(
        map((response: any) => {
          const message = response;
          return message;
        })
      );
  }

  /**
   * Logout the user
   */
  logout() {
    // logout the user
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenType");
  }

  /**
   * refreshToken if the token is expired
   */
  private refreshToken() {
    this.usersService
      .postApiUsersRefresh({
        body: { refreshToken: localStorage.getItem("refreshToken") },
      })
      .pipe(
        map((response: AccessTokenResponse) => {
          this.setAuthData(response);

          return response;
        }),
        catchError((error) => {
          this.logout();
          return error;
        })
      );
  }

  private setAuthData(response: AccessTokenResponse) {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("expiresIn", response.expiresIn.toString());
    localStorage.setItem("tokenType", response.tokenType);
  }
}
