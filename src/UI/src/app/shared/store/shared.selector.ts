import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SharedState } from "./shared.reducer";

export const SHARED_FEATURE_NAME = "shared";

export const selectSharedState =
  createFeatureSelector<SharedState>(SHARED_FEATURE_NAME);

export const selectIsLoading = createSelector(
  selectSharedState,
  (state: SharedState) => state.activeHttpRequests > 0
);

export const selectError = createSelector(
  selectSharedState,
  (state: SharedState) => state.error
);
