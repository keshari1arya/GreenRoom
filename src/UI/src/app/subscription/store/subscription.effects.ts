import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, concatMap } from "rxjs/operators";
import * as SubscriptionActions from './subscription.actions';
import { from, of } from 'rxjs';
import { SubscriptionService } from 'src/app/lib/openapi-generated/services';



@Injectable()
export class SubscriptionEffects {
  constructor(
    private actions$: Actions,
    private service: SubscriptionService,
  ) { }

  loadSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.loadSubscription),
      mergeMap(() => {
        return this.service.getSubscriptions().pipe(
          map(data => SubscriptionActions.SubscriptionSuccess({ subscriptions: data })),
          catchError(error => of(SubscriptionActions.SubscriptionError({ error: error.message })))
        )
      })
    )
  )


  updateSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.updateSubscription),
      mergeMap(({ subscriptions }) =>
        from(this.service.updateSubscription({
          body: subscriptions,
          id: subscriptions.id
        }))
          .pipe(
            map(() =>
              SubscriptionActions.subscriptionUpdateSuccess({ subscriptionsId: subscriptions.id })),
            catchError((error) => of(SubscriptionActions.SubscriptionError({ error: error.message })))
          )
      )
    )
  );

  //create subscription
  createSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.createSubscription),
      mergeMap(({ subscriptions }) =>
        from(this.service.createSubscription({
          body: subscriptions
        }))
          .pipe(
            map((createdSubscriptionId) =>
              SubscriptionActions.subscriptionCreateSuccess({ subscriptionsId: createdSubscriptionId })),
            catchError((error) => of(SubscriptionActions.SubscriptionError({ error: error.message })))
          )
      )
    )
  );
}
