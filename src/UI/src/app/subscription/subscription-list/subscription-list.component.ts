import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  selectData,
  selectDataError,
  selectDataLoading,
} from "../store/subscription.selectors";
import { loadSubscription } from "../store/subscription.actions";
import { Observable, of } from "rxjs";
import { SubscriptionDto } from "src/app/lib/openapi-generated/models";
import { Router } from "@angular/router";
import { multitenantActions } from "src/app/multitenant/store/multitenant.actions";

@Component({
  selector: "app-subscription-list",
  templateUrl: "./subscription-list.component.html",
  styleUrl: "./subscription-list.component.css",
})
export class SubscriptionListComponent implements OnInit {
  subscriptions$: Observable<SubscriptionDto[]> = of([]);
  loading$: Observable<boolean>;
  error$: Observable<string>;

  constructor(private store: Store, private router: Router) {
    this.subscriptions$ = store.select(selectData);
    this.loading$ = store.select(selectDataLoading);
    this.error$ = store.select(selectDataError);
  }

  ngOnInit(): void {
    this.store.dispatch(loadSubscription());
  }

  purchase(id: number) {
    this.store.dispatch(
      multitenantActions.prepareSubscriptionPurchase({ subscriptionId: id })
    );
  }
}
