import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, concatMap } from "rxjs/operators";
import * as SubscriptionActions from './subscription.actions';
import { of } from 'rxjs';
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
        console.log("effect called");
        return this.service.getSubscriptions().pipe(
          map(data => SubscriptionActions.SubscriptionSuccess({ data })),
          catchError(error => of(SubscriptionActions.SubscriptionError({ error: error.message })))
        )
      })
    )
  )

}
