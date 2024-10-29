import { ActionReducerMap } from "@ngrx/store";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import {
  AuthenticationState,
  authenticationReducer,
} from "../account/auth/store/authentication.reducer";
import { sharedReducer, SharedState } from "../shared/store/shared.reducer";

export interface RootReducerState {
  layout: LayoutState;
  auth: AuthenticationState;
  shared: SharedState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  layout: layoutReducer,
  auth: authenticationReducer,
  shared: sharedReducer,
};
