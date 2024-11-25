import { Action, createAction, props } from "@ngrx/store";
import {
  CreateSubscriptionCommand,
  SubscriptionDetailsDto,
  SubscriptionDto,
  UpdateSubscriptionCommand,
} from "src/app/lib/openapi-generated/models";

export const SubscriptionError = createAction(
  "[Subscription] Subscription Error",
  props<{ error: string }>()
);

//subscription-list
export const loadSubscription = createAction(
  "[Subscription] Load Subscription"
);
export const SubscriptionSuccess = createAction(
  "[Subscription] Subscription Success",
  props<{ subscriptions: SubscriptionDto[] }>()
);

//id state
export const editSubscriptionById = createAction(
  "[Subscription] Edit Subscription By Id",
  props<{ id: number }>()
);
export const editSubscriptionByIdSuccess = createAction(
  "[Subscription] Edit Subscription By Id Success",
  props<{ subscriptionsById: SubscriptionDetailsDto }>()
);

//subscription-create
export const createSubscription = createAction(
  "[Subscription] Create Subscription",
  props<{ subscriptions: CreateSubscriptionCommand }>()
);
export const subscriptionCreateSuccess = createAction(
  "[Subscription] Subscription Create Success",
  props<{ subscriptionsId: number }>()
);

//subscription-update
export const updateSubscription = createAction(
  "[Subscription] Update Subscription",
  props<{ subscriptions: UpdateSubscriptionCommand }>()
);
export const subscriptionUpdateSuccess = createAction(
  "[Subscription] Subscription Update Success",
  props<{ subscriptionsId: number }>()
);
