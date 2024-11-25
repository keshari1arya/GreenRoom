import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, mergeMap, map } from "rxjs/operators";
import * as SubscriptionActions from "./subscription.actions";
import { from, of } from "rxjs";
import { SubscriptionService } from "src/app/lib/openapi-generated/services";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class SubscriptionEffects {
  constructor(
    private actions$: Actions,
    private service: SubscriptionService,
    private toastr: ToastrService
  ) {}

  loadSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.loadSubscription),
      mergeMap(() => {
        return this.service.getSubscriptions().pipe(
          map((data) =>
            SubscriptionActions.SubscriptionSuccess({ subscriptions: data })
          ),
          catchError((error) =>
            of(SubscriptionActions.SubscriptionError({ error: error.message }))
          )
        );
      })
    )
  );

  updateSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.updateSubscription),
      mergeMap(({ subscriptions }) =>
        from(
          this.service.updateSubscription({
            body: subscriptions,
            id: subscriptions.id,
          })
        ).pipe(
          map(() => {
            this.toastr.success(
              "Subscription updated successfully",
              "Success",
              {
                closeButton: true,
                progressBar: true,
              }
            );
            return SubscriptionActions.subscriptionUpdateSuccess({
              subscriptionsId: subscriptions.id,
            });
          }),
          catchError((error) => {
            this.toastr.error("Fails to update subscription", "Error", {
              closeButton: true,
              progressBar: true,
            });
            return of(
              SubscriptionActions.SubscriptionError({ error: error.message })
            );
          })
        )
      )
    )
  );

  //create subscription
  createSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.createSubscription),
      mergeMap(({ subscriptions }) =>
        from(
          this.service.createSubscription({
            body: subscriptions,
          })
        ).pipe(
          map((createdSubscriptionId) => {
            this.toastr.success(
              "Subscription created successfully",
              "Success",
              {
                closeButton: true,
                progressBar: true,
              }
            );
            return SubscriptionActions.subscriptionCreateSuccess({
              subscriptionsId: createdSubscriptionId,
            });
          }),
          catchError((error) => {
            this.toastr.error("Failed to create subscription", "Error", {
              closeButton: true,
              progressBar: true,
            });
            return of(
              SubscriptionActions.SubscriptionError({ error: error.message })
            );
          })
        )
      )
    )
  );

  //set details of Subscription
  fetchSubscriptionById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SubscriptionActions.editSubscriptionById),
      mergeMap(({ id }) =>
        from(this.service.getSubscriptionDetails({ id })).pipe(
          map((data) =>
            SubscriptionActions.editSubscriptionByIdSuccess({
              subscriptionsById: data,
            })
          ),
          catchError((error) =>
            of(SubscriptionActions.SubscriptionError({ error: error.message }))
          )
        )
      )
    )
  );
}
