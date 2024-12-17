import { Injectable } from "@angular/core";

import { catchError, from, map, of } from "rxjs";
import { UsersService } from "src/app/lib/openapi-generated/services";
import { AccessTokenResponse } from "src/app/lib/openapi-generated/models";
import { TokenStorageService } from "./token-storage.service";
import { ActivatedRoute, Route, Router } from "@angular/router";

// TODO: Remove AuthService from project and place it's code to token/tokenManagement service. Use userServices to get the token and register the user.
@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenStorageService,
    private route: Router
  ) {}

  /**
   * Returns the current user
   */
  public getToken(): string {
    return localStorage.getItem("token");
  }

  /**
   * Returns the current tenant id
   */
  public tenantId(): string {
    return localStorage.getItem("tenantId");
  }

  /**
   * @returns true if the token is expired
   */
  public isTokenExpired(): boolean {
    const expiresOn = localStorage.getItem("expiresOn");
    if (!expiresOn) {
      return true;
    }

    return new Date().getTime() > parseInt(expiresOn, 10);
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
    localStorage.removeItem("expiresOn");
    localStorage.removeItem("tokenType");
  }

  setCurrentTenant(tenantId: string) {
    localStorage.setItem("tenantId", tenantId);
  }

  /**
   * refreshToken if the token is expired
   */
  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  /**
   * Set the auth data
   * @param response
   */
  setAuthData(response: AccessTokenResponse) {
    localStorage.setItem("token", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    const expiresOn = new Date().getTime() + response.expiresIn * 1000;
    localStorage.setItem("expiresOn", expiresOn.toString());
    localStorage.setItem("tokenType", response.tokenType);
  }

  refreshAuthDataWithRefreshToken() {
    return this.usersService
      .postApiUsersRefresh({
        body: {
          refreshToken: this.getRefreshToken(),
        },
      })
      .pipe(
        map((response) => {
          this.setAuthData(response);
          return response;
        })
      );
  }
}
