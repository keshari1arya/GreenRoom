import { NgModule } from '@angular/core';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SubscriptionRoutingModule } from './subscription-routing.module';



@NgModule({
  declarations: [
    SubscriptionListComponent
  ],
  imports: [

    SubscriptionRoutingModule,
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SubscriptionModule { }
