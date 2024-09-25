import { createAction, props } from "@ngrx/store";
import { setError } from "src/app/file-manager/store/file-manager.actions";
import { TenantDto } from "src/app/lib/openapi-generated/models";

export const multitenantActions = {
  setError: createAction("[Multitenant] set error", props<{ error: any }>()),
  fetchTenant: createAction("[Multitenant] fetch Tenant details"),
  fetchTenantSuccess: createAction(
    "[Multitenant] fetch Tenant details success",
    props<{ tenant: TenantDto }>()
  ),
};
