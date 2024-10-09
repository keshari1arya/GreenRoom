import { createAction, props } from "@ngrx/store";
import {
  CreateTenantCommand,
  TenantDetailsDto,
  TenantUsersDto,
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
    props<{ tenantId: string }>()
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
    props<{ tenantId: string }>()
  ),

  // Update Tenant
  updateTenant: createAction(
    "[Multitenant] update Tenant",
    props<{ tenant: UpdateTenantCommand }>()
  ),
  updateTenantSuccess: createAction(
    "[Multitenant] update Tenant success",
    props<{ tenantId: string }>()
  ),

  // Tenant Users
  fetchTenantUsers: createAction("[Multitenant] fetch Tenant Users"),
  fetchTenantUsersSuccess: createAction(
    "[Multitenant] fetch Tenant Users success",
    props<{ tenantUsers: TenantUsersDto[] }>()
  ),
};
