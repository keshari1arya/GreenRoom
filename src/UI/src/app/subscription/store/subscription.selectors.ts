import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubscriptionState } from './subscription.reducer';
import { state } from '@angular/animations';

export const selectSubscriptionState = createFeatureSelector<SubscriptionState>('subscription');

export const selectData = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.data
)

export const selectDataLoading = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.loading
)

export const selectDataError = createSelector(
    selectSubscriptionState,
    (state: SubscriptionState) => state.error
)