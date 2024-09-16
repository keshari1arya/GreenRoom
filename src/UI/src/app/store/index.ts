import { ActionReducerMap } from "@ngrx/store";
import { LayoutState, layoutReducer } from "./layouts/layouts.reducer";
import {
  AuthenticationState,
  authenticationReducer,
} from "../account/auth/store/authentication.reducer";

export interface RootReducerState {
  layout: LayoutState;
  auth: AuthenticationState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
  layout: layoutReducer,
  auth: authenticationReducer,
};
