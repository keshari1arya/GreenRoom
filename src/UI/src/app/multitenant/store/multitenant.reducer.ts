import { createReducer, on } from "@ngrx/store";
import {
  SearchUserDto,
  TenantDetailsDto,
  TenantDto,
  TenantRolesDto,
  TenantUsersDto,
} from "src/app/lib/openapi-generated/models";
import { multitenantActions } from "./multitenant.actions";

export interface MultitenantState {
  loading: boolean;
  error: any;
  tenant: TenantDetailsDto;
  tenantUsers: TenantUsersDto[];
  searchedUsers: SearchUserDto[];
  tenantRoles: TenantRolesDto[];
  tenantList: TenantDto[];
  userInvited: boolean;
}

export const initialState: MultitenantState = {
  tenant: null,
  tenantUsers: [],
  searchedUsers: [],
  tenantRoles: [],
  tenantList: [],
  loading: false,
  error: null,
  userInvited: false,
};

export const MultitenantReducer = createReducer(
  initialState,
  on(multitenantActions.setError, (state, { error }) => {
    return { ...state, error, loading: false };
  }),
  on(multitenantActions.fetchCurrentTenantDetails, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(
    multitenantActions.fetchCurrentTenantDetailsSuccess,
    (state, { tenant }) => {
      return { ...state, tenant, loading: false };
    }
  ),
  on(multitenantActions.fetchTenantById, (state) => {
    return { ...state, loading: true, error: null };
  }),
  on(multitenantActions.fetchTenantByIdSuccess, (state, { tenant }) => {
    return { ...state, tenant, loading: false };
  }),
  on(multitenantActions.fetchTenantUsersSuccess, (state, { tenantUsers }) => {
    return { ...state, tenantUsers, loading: false };
  }),
  on(multitenantActions.searchUsersSuccess, (state, { users }) => {
    return { ...state, searchedUsers: users, loading: false };
  }),
  on(multitenantActions.addUserSuccess, (state, { userId }) => {
    return {
      ...state,
      userId,
      loading: false,
    };
  }),
  on(multitenantActions.updateRoleIdSuccess, (state, { userId }) => {
    return {
      ...state,
      userId,
      loading: false,
    };
  }),
  on(multitenantActions.getTenantRolesSuccess, (state, { userRole }) => {
    return {
      ...state,
      tenantRoles: userRole,
      loading: false,
    };
  }),
  on(multitenantActions.fetchMyTenantListSuccess, (state, { myTenantList }) => {
    return { ...state, tenantList: myTenantList, loading: false };
  }),
  on(multitenantActions.clearSearchResults, (state) => {
    return { ...state, searchedUsers: [] };
  }),
  on(multitenantActions.inviteUserSuccess, (state) => {
    return { ...state, loading: false, userInvited: true };
  })
);
