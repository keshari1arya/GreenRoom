import { Action, createAction, props } from "@ngrx/store";

export const Subscription = createAction("[Subscription] Subscription");
export const SubscriptionSuccess = createAction("[Subscription] Subscription Success", props<{ data: any[] }>());
export const SubscriptionError = createAction("[Subscription] Subscription Error", props<{ error: string }>());