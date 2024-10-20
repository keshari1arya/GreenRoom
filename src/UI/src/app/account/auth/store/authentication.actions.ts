import { createAction, props } from "@ngrx/store";
import {
  TenantDto,
  VerifyUserInvitationResponse,
} from "src/app/lib/openapi-generated/models";

const setError = createAction(
  "[Authentication] Error",
  props<{ error: string }>()
);
// Register action
const register = createAction(
  "[Authentication] Register",
  props<{ email: string; password: string }>()
);
const registerSuccess = createAction("[Authentication] Register Success");

// login action
const login = createAction(
  "[Authentication] Login",
  props<{ email: string; password: string }>()
);
const loginSuccess = createAction("[Authentication] Login Success");

// logout action
const logout = createAction("[Authentication] Logout");

const logoutSuccess = createAction("[Auth] Logout Success");

// fetch my tenants action
const fetchMyTenants = createAction("[Authentication] Fetch My Tenants");

const fetchMyTenantsSuccess = createAction(
  "[Authentication] Fetch My Tenants Success",
  props<{ tenants: TenantDto[] }>()
);

// verify user invitation action
const verifyInvitation = createAction(
  "[Authentication] Verify Invitation",
  props<{ token: string }>()
);

const verifyInvitationSuccess = createAction(
  "[Authentication] Verify Invitation Success",
  props<{ response: VerifyUserInvitationResponse }>()
);

export const AuthActions = {
  setError: setError,
  register,
  registerSuccess,
  login,
  loginSuccess,
  logout,
  logoutSuccess,
  fetchMyTenants,
  fetchMyTenantsSuccess,
  verifyInvitation,
  verifyInvitationSuccess,
};
