import { createReducer, on } from '@ngrx/store';
import * as SubscriptionActions from './subscription.actions';

export interface SubscriptionState {
  data: any[];
  loading: boolean;
  error: string | null;
}

export const initialState: SubscriptionState = {
  data: [],
  loading: false,
  error: null,
};

export const SubscriptionReducer = createReducer(
  initialState,
  on(SubscriptionActions.Subscription, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(SubscriptionActions.SubscriptionSuccess, state => ({
    ...state,
    loading: false,
    data: state.data
  })),
  on(SubscriptionActions.SubscriptionError, state => ({
    ...state,
    loading: false,
    error: state.error
  }))
);

