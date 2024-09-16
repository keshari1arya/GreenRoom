import { createReducer, on } from "@ngrx/store";
import { AuthActions } from "./authentication.actions";

export interface AuthenticationState {
  isLoggedIn: boolean;
  error: string | null;
}

const initialState: AuthenticationState = {
  isLoggedIn: false,
  error: null,
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
  on(AuthActions.logout, (state) => ({ ...state, user: null }))
);
