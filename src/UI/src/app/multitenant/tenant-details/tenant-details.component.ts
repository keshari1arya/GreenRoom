import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { multitenantActions } from "../store/multitenant.actions";
import { MultitenantState } from "../store/multitenant.reducer";
import { selectTenant } from "../store/multitenant.selector";

@Component({
  selector: "app-tenant-details",
  templateUrl: "./tenant-details.component.html",
  styleUrl: "./tenant-details.component.scss",
})
export class TenantDetailsComponent implements OnInit {
  breadCrumbItems = [
    { label: "Projects" },
    { label: "Projects Overview", active: true },
  ];

  currentTenant$ = this.store.select(selectTenant);

  constructor(private store: Store<MultitenantState>) {}

  ngOnInit(): void {
    this.store.dispatch(multitenantActions.fetchTenant());
  }
}
