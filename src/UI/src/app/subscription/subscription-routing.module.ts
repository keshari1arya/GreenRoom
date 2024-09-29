import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { SubscriptionCreateComponent } from './subscription-create/subscription-create.component';

const routes: Routes = [
    { path: "", component: SubscriptionListComponent },
    { path: "create", component: SubscriptionCreateComponent },
    { path: ":id/edit", component: SubscriptionCreateComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],  // forChild because it's a feature module
    exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
