import { createReducer, on } from "@ngrx/store";
import { TenantDto } from "src/app/lib/openapi-generated/models";
import { multitenantActions } from "./multitenant.actions";

export interface MultitenantState {
  loading: boolean;
  error: any;
  tenant: TenantDto;
}

export const initialState: MultitenantState = {
  tenant: null,
  loading: false,
  error: null,
};

export const MultitenantReducer = createReducer(
  initialState,
  on(multitenantActions.setError, (state, { error }) => {
    return { ...state, error, loading: false };
  }),
  on(multitenantActions.fetchTenant, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(multitenantActions.fetchTenantSuccess, (state, { tenant }) => {
    return { ...state, tenant, loading: false };
  })
);
