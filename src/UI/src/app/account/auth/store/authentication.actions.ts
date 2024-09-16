import { createAction, props } from "@ngrx/store";

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

export const AuthActions = {
  setError: setError,
  register,
  registerSuccess,
  login,
  loginSuccess,
  logout,
  logoutSuccess,
};
