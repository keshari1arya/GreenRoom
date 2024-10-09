import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { multitenantActions } from "../store/multitenant.actions";
import { MultitenantState } from "../store/multitenant.reducer";
import { selectTenant } from "../store/multitenant.selector";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tenant-details",
  templateUrl: "./tenant-details.component.html",
  styleUrl: "./tenant-details.component.scss",
})
export class TenantDetailsComponent implements OnInit {
  breadCrumbItems = [
    { label: "Tenant" },
    { label: "Tenant Overview", active: true },
  ];

  currentTenant$ = this.store.select(selectTenant);

  constructor(
    private store: Store<MultitenantState>,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const tenantId = params.get("id");
      if (tenantId) {
        this.store.dispatch(
          multitenantActions.fetchTenantById({ tenantId: tenantId })
        );
      } else {
        this.store.dispatch(multitenantActions.fetchCurrentTenantDetails());
      }
    });
  }
}
