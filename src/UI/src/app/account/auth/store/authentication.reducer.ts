import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./authentication.actions";
import { VerifyUserInvitationResponse } from "src/app/lib/openapi-generated/models";

export interface AuthenticationState {
  isLoggedIn: boolean;
  error: string | null;
  userVerificationResponse: VerifyUserInvitationResponse | null;
}

const initialState: AuthenticationState = {
  isLoggedIn: false,
  error: null,
  userVerificationResponse: null,
};

export const authenticationReducer = createReducer(
  initialState,
  on(AuthActions.setError, (state, { error }) => ({ ...state, error })),
  on(AuthActions.register, (state) => ({ ...state, error: null })),
  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    error: null,
  })),

  on(AuthActions.login, (state) => ({ ...state, error: null })),
  on(AuthActions.loginSuccess, (state) => ({
    ...state,
    isLoggedIn: true,
    error: null,
  })),
  on(AuthActions.logout, (state) => ({ ...state, user: null })),
  on(AuthActions.verifyInvitationSuccess, (state, { response }) => ({
    ...state,
    userVerificationResponse: response,
  }))
);
