import { NgModule } from '@angular/core';
import { SubscriptionListComponent } from './subscription-list/subscription-list.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SubscriptionRoutingModule } from './subscription-routing.module';
import { SubscriptionReducer } from './store/subscription.reducer';
import { SubscriptionEffects } from './store/subscription.effects';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { SUBSCRIPTION_STORE } from './store/subscription.selectors';



@NgModule({
  declarations: [
    SubscriptionListComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    StoreModule.forFeature(SUBSCRIPTION_STORE, SubscriptionReducer),
    EffectsModule.forFeature([SubscriptionEffects]),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SubscriptionModule { }
