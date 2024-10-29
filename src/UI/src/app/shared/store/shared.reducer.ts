import { createReducer, on } from "@ngrx/store";
import {
  addHttpRequestForLoader,
  removeHttpRequestForLoader,
  setError,
} from "./shared.actions";

export interface SharedState {
  error: any;
  activeHttpRequests: number;
}

export const initialState: SharedState = {
  error: null,
  activeHttpRequests: 0,
};

export const sharedReducer = createReducer(
  initialState,
  on(setError, (state, { error }) => {
    return { ...state, error, loading: false };
  }),
  on(addHttpRequestForLoader, (state) => {
    return { ...state, activeHttpRequests: state.activeHttpRequests + 1 };
  }),
  on(removeHttpRequestForLoader, (state) => {
    return { ...state, activeHttpRequests: state.activeHttpRequests - 1 };
  })
);
