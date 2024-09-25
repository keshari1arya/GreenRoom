import { Action, createAction, props } from "@ngrx/store";
import { SubscriptionDto } from "src/app/lib/openapi-generated/models";

export const loadSubscription = createAction("[Subscription] Load Subscription");
export const SubscriptionSuccess = createAction("[Subscription] Subscription Success", props<{ data: SubscriptionDto[] }>());
export const SubscriptionError = createAction("[Subscription] Subscription Error", props<{ error: string }>());