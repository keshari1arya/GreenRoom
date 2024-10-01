import { createReducer, on } from '@ngrx/store';
import * as SubscriptionActions from './subscription.actions';
import { SubscriptionDto } from 'src/app/lib/openapi-generated/models';
import { updateSubscription } from 'src/app/lib/openapi-generated/fn/subscription/update-subscription';

export interface SubscriptionState {
  subscriptions: SubscriptionDto[];
  loading: boolean;
  error: string | null;
}

export const initialState: SubscriptionState = {
  subscriptions: [],
  loading: false,
  error: null,
};

export const SubscriptionReducer = createReducer(
  initialState,
  on(SubscriptionActions.SubscriptionError, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error: error
    }
  }),
  //subscription-list
  on(SubscriptionActions.loadSubscription, (state) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on(SubscriptionActions.SubscriptionSuccess, (state, { subscriptions }) => {
    return { ...state, loading: false, subscriptions }
  }),
  //create-subscription
  on(SubscriptionActions.createSubscription, (state) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on(SubscriptionActions.subscriptionCreateSuccess, (state, { subscriptionsId }) => {
    return {
      ...state,
      loading: false,
      subscriptionsId
    }
  }),

  on(SubscriptionActions.editSubscriptionByIdSuccess, (state, { subscriptions }) => {
    return { ...state, loading: false, subscriptions }
  }),

  //update-subscription
  on(SubscriptionActions.updateSubscription, (state) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on(SubscriptionActions.subscriptionUpdateSuccess, (state, { subscriptionsId }) => {
    return {
      ...state,
      loading: false,
      subscriptionsId
    }
  })

);

