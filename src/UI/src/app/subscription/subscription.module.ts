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
import { EditSubscriptionComponent } from './edit-subscription/edit-subscription.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UIModule } from "../shared/ui/ui.module";



@NgModule({
  declarations: [
    SubscriptionListComponent,
    EditSubscriptionComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SubscriptionRoutingModule,
    StoreModule.forFeature(SUBSCRIPTION_STORE, SubscriptionReducer),
    EffectsModule.forFeature([SubscriptionEffects]),
    ReactiveFormsModule,
    UIModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class SubscriptionModule { }
