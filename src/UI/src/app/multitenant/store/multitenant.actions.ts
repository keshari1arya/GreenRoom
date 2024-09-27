import { createAction, props } from "@ngrx/store";
import {
  CreateTenantCommand,
  TenantDetailsDto,
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
};
