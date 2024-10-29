import { createAction, props } from "@ngrx/store";

export const setError = createAction(
  "[Shared] Set Error",
  props<{ error: any }>()
);

export const addHttpRequestForLoader = createAction(
  "[Shared] Add Http Request For Loader"
);

export const removeHttpRequestForLoader = createAction(
  "[Shared] Remove Http Request For Loader"
);
