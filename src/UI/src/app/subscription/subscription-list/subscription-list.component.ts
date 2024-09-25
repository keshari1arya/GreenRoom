import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectData, selectDataError, selectDataLoading } from '../store/subscription.selectors';
import { loadSubscription } from '../store/subscription.actions';
import { Observable, of } from 'rxjs';
import { SubscriptionDto } from 'src/app/lib/openapi-generated/models';


@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.css'
})
export class SubscriptionListComponent implements OnInit {
  subscriptions$: Observable<SubscriptionDto[]> = of([]);
  loading$: Observable<boolean>;
  error$: Observable<string>;

  constructor(private store: Store) {
    this.subscriptions$ = store.select(selectData);
    this.loading$ = store.select(selectDataLoading);
    this.error$ = store.select(selectDataError);
  }

  ngOnInit(): void {
    console.log("subscription list called");
    this.store.dispatch(loadSubscription());
    this.subscriptions$.subscribe(
      (Data) => {
        console.log('Subscription Data:', Data); // Check if this logs the correct data
      },
      (error) => {
        console.error('Error fetching subscription data:', error); // Log any errors
      }
    );
  }

}
