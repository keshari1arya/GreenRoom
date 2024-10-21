import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthenticationState } from "./authentication.reducer";

export const getLayoutState =
  createFeatureSelector<AuthenticationState>("auth");

export const getisLoggedIn = createSelector(
  getLayoutState,
  (state: AuthenticationState) => state.isLoggedIn
);

export const getError = createSelector(
  getLayoutState,
  (state: AuthenticationState) => state.error
);

export const getUserVerificationResponse = createSelector(
  getLayoutState,
  (state: AuthenticationState) => state.userVerificationResponse
);
