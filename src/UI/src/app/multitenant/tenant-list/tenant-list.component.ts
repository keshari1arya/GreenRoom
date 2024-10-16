import { Component } from '@angular/core';
import { MultitenantState } from '../store/multitenant.reducer';
import { Store } from '@ngrx/store';
import { selectMyTenantList } from '../store/multitenant.selector';
import { multitenantActions } from '../store/multitenant.actions';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrl: './tenant-list.component.scss'
})
export class TenantListComponent {

  myTenants$ = this.store.select(selectMyTenantList);
  constructor
    (
      private store: Store<MultitenantState>
    ) { }

  ngOnInit(): void {
    this.store.dispatch(multitenantActions.fetchMyTenantList());
    this.myTenants$.subscribe((res) => {
      console.log(res);
    })
  }
}
