import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MultitenantState } from "./multitenant.reducer";

export const MULTITENANT_FEATURE_NAME = "multitenant";

export const selectMultitenantState = createFeatureSelector<MultitenantState>(
  MULTITENANT_FEATURE_NAME
);

export const selectMultitenantLoading = createSelector(
  selectMultitenantState,
  (state: MultitenantState) => state.loading
);

export const selectMultitenantError = createSelector(
  selectMultitenantState,
  (state: MultitenantState) => state.error
);

export const selectTenant = createSelector(
  selectMultitenantState,
  (state: MultitenantState) => state.tenant
);
