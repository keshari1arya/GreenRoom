import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap, map, catchError, of } from "rxjs";
import { multitenantActions } from "./multitenant.actions";
import { TenantService } from "src/app/lib/openapi-generated/services";

@Injectable()
export class MultitenantEffects {
  fetchTenantDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(multitenantActions.fetchTenant),
      switchMap(() =>
        this.tenantService.getCurrentTenant().pipe(
          map((tenantDetails) =>
            multitenantActions.fetchTenantSuccess({ tenant: tenantDetails })
          ),
          catchError((error) => of(multitenantActions.setError({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private tenantService: TenantService
  ) {}
}
