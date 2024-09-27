import { createReducer, on } from '@ngrx/store';
import * as SubscriptionActions from './subscription.actions';
import { SubscriptionDto } from 'src/app/lib/openapi-generated/models';

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
  on(SubscriptionActions.loadSubscription, (state) => {
    return {
      ...state,
      loading: true,
      error: null
    }
  }),
  on(SubscriptionActions.SubscriptionSuccess, (state, { data }) => {
    return { ...state, loading: false, subscriptions: data }
  }),
  on(SubscriptionActions.SubscriptionError, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error: error
    }
  })
);

