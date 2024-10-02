import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { multitenantActions } from '../store/multitenant.actions';
import { selectMultitenantError, selectMultitenantLoading, selectTenant, selectTenantUsers } from '../store/multitenant.selector';
import { Observable, of } from 'rxjs';
import { TenantUsersDto } from 'src/app/lib/openapi-generated/models';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent implements OnInit {

  tenantUsers$!: Observable<TenantUsersDto[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string>;

  constructor(private store: Store) {
    this.tenantUsers$ = this.store.select(selectTenantUsers);
    this.loading$ = this.store.select(selectMultitenantLoading);
    this.error$ = this.store.select(selectMultitenantError);
  }

  ngOnInit(): void {
    this.store.dispatch(multitenantActions.fetchTenantUsers());
  }

}
