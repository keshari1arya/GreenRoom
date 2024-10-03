import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';

const routes: Routes = [
    { path: "", component: SubscriptionListComponent },
    { path: ":id/edit", component: EditSubscriptionComponent },
    { path: "create", component: EditSubscriptionComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],  // forChild because it's a feature module
    exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
