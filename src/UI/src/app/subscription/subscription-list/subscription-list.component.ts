import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectData, selectDataError, selectDataLoading } from '../store/subscription.selectors';
import { Subscription } from '../store/subscription.actions';


@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrl: './subscription-list.component.css'
})
export class SubscriptionListComponent implements OnInit {
  data$: any;
  loading$: any;
  error$: any;
  constructor(private store: Store) {
    this.data$ = store.select(selectData);
    this.loading$ = store.select(selectDataLoading);
    this.error$ = store.select(selectDataError);
  }

  ngOnInit(): void {
    this.store.dispatch(Subscription());
    console.log(this.data$);
  }

}
