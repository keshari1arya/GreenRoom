import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, map, concatMap } from "rxjs/operators";
import { SubscriptionService } from '../service/subscription.service';
import * as SubscriptionActions from './subscription.actions';
import { of } from 'rxjs';



@Injectable()
export class SubscriptionEffects {
  constructor(
    private actions$: Actions,
    private service: SubscriptionService,
  ) { }

  loadSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.Subscription),
      mergeMap(() => this.service.getSubscription().pipe(
        map(data => SubscriptionActions.SubscriptionSuccess({ data })),
        catchError(error => of(SubscriptionActions.SubscriptionError({ error })))
      ))
    )
  )

}
