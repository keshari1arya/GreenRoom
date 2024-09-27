import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubscriptionState } from './subscription.reducer';
import { state } from '@angular/animations';

export const SUBSCRIPTION_STORE = "subscription";

export const selectSubscriptionState = createFeatureSelector<SubscriptionState>(SUBSCRIPTION_STORE);

export const selectData = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.subscriptions
)

export const selectDataLoading = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.loading
)

export const selectDataError = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.error
)