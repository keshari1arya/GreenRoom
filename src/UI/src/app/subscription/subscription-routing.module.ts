import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';

const routes: Routes = [
    { path: "", component: SubscriptionListComponent },  // Define the route
];

@NgModule({
    imports: [RouterModule.forChild(routes)],  // forChild because it's a feature module
    exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
