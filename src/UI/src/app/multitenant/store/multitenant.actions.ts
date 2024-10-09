import { createAction, props } from "@ngrx/store";
import {
  AddTenantUserDto,
  CreateTenantCommand,
  SearchUserDto,
  TenantDetailsDto,
  TenantRolesDto,
  TenantUsersDto,
  UpdateRoleCommand,
  UpdateTenantCommand,
} from "src/app/lib/openapi-generated/models";

export const multitenantActions = {
  setError: createAction("[Multitenant] set error", props<{ error: any }>()),
  fetchCurrentTenantDetails: createAction(
    "[Multitenant] fetch current Tenant details"
  ),
  fetchCurrentTenantDetailsSuccess: createAction(
    "[Multitenant] fetch current Tenant details success",
    props<{ tenant: TenantDetailsDto }>()
  ),
  fetchTenantById: createAction(
    "[Multitenant] fetch Tenant by Id",
    props<{ tenantId: number }>()
  ),
  fetchTenantByIdSuccess: createAction(
    "[Multitenant] fetch Tenant by Id success",
    props<{ tenant: TenantDetailsDto }>()
  ),

  // Create Tenant
  createTenant: createAction(
    "[Multitenant] create Tenant",
    props<{ tenant: CreateTenantCommand }>()
  ),
  createTenantSuccess: createAction(
    "[Multitenant] create Tenant success",
    props<{ tenantId: number }>()
  ),

  // Update Tenant
  updateTenant: createAction(
    "[Multitenant] update Tenant",
    props<{ tenant: UpdateTenantCommand }>()
  ),
  updateTenantSuccess: createAction(
    "[Multitenant] update Tenant success",
    props<{ tenantId: number }>()
  ),

  // Tenant Users
  fetchTenantUsers: createAction(
    "[Multitenant] fetch Tenant Users"
  ),
  fetchTenantUsersSuccess: createAction(
    "[Multitenant] fetch Tenant Users success",
    props<{ tenantUsers: TenantUsersDto[] }>()
  ),

  //Search Users
  searchUsers: createAction(
    "[Multitenant] Search Users",
    props<{ searchTerm: string }>()
  ),
  searchUsersSuccess: createAction(
    "[Multitenant] Search Users success",
    props<{ users: SearchUserDto[] }>()
  ),

  // Add User
  addUser: createAction(
    "[Multitenant] Add User",
    props<{ user: AddTenantUserDto }>()
  ),
  addUserSuccess: createAction(
    "[Multitenant] Add User success",
    props<{ userId: number }>()
  ),

  // Edit Role
  updateRoleId: createAction(
    "[Multitenant] Update Role Id",
    props<{ userRole: UpdateRoleCommand }>()
  ),
  updateRoleIdSuccess: createAction(
    "[Multitenant] Update Role Id success",
    props<{ userId: number }>()
  ),

  // Get Role
  getTenantRoles: createAction(
    "[Multitenant] Get Tenant  Role Id"
  ),
  getTenantRolesSuccess: createAction(
    "[Multitenant] Get Tenant  Role Id success",
    props<{ userRole: TenantRolesDto[] }>()
  ),
};
