import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { Login2Component } from "./login2/login2.component";

import { SignupComponent } from "./signup/signup.component";
import { PasswordresetComponent } from "./passwordreset/passwordreset.component";
import { Register2Component } from "./register2/register2.component";
import { Recoverpwd2Component } from "./recoverpwd2/recoverpwd2.component";
import { verifyUserInvitation } from "src/app/lib/openapi-generated/fn/users/verify-user-invitation";
import { VerifyUserInvitationComponent } from "./verify-user-invitation/verify-user-invitation.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "signup",
    component: SignupComponent,
  },
  {
    path: "signup-2",
    component: Register2Component,
  },
  {
    path: "reset-password",
    component: PasswordresetComponent,
  },
  {
    path: "recoverpwd-2",
    component: Recoverpwd2Component,
  },
  {
    path: "login-2",
    component: Login2Component,
  },
  {
    path: "verify-user-invitation",
    component: VerifyUserInvitationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
