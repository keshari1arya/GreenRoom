import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";

import { environment } from "../environments/environment";

// Swiper Slider
import { SlickCarouselModule } from "ngx-slick-carousel";
// bootstrap component
import { TabsModule } from "ngx-bootstrap/tabs";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { ToastrModule } from "ngx-toastr";
import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";

// Store
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
// Page Route
import { ExtrapagesModule } from "./extrapages/extrapages.module";
import { LayoutsModule } from "./layouts/layouts.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

// Auth
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { ErrorInterceptor } from "./core/helpers/error.interceptor";
import { JwtInterceptor } from "./core/helpers/jwt.interceptor";
import { rootReducer } from "./store";
import { AuthenticationEffects } from "./account/auth/store/authentication.effects";

import { SubscriptionReducer } from "./subscription/store/subscription.reducer";
import { SubscriptionEffects } from "./subscription/store/subscription.effects";
import { SUBSCRIPTION_STORE } from "./subscription/store/subscription.selectors";
export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    StoreModule.forFeature(SUBSCRIPTION_STORE, SubscriptionReducer),
    EffectsModule.forRoot([SubscriptionEffects]),
    EffectsModule.forFeature([SubscriptionEffects]),
    StoreModule.forFeature("subscription", SubscriptionReducer),
    LayoutsModule,
    AppRoutingModule,
    ExtrapagesModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    // SharedModule,
    ScrollToModule.forRoot(),
    SlickCarouselModule,
    ToastrModule.forRoot(),
    StoreModule.forRoot(rootReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      // OrderEffects,
      AuthenticationEffects,
      // CartEffects,
      // ProjectEffects,
      // usersEffects,
      // userslistEffects,
      // JoblistEffects,
      // CandidateEffects,
      // InvoiceDataEffects,
      // ChatEffects,
      // tasklistEffects,
      // OrdersEffects,
      // CustomerEffects,
      // MailEffects
    ]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
