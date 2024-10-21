import { Component, OnInit } from "@angular/core";
import { AuthActions } from "../store/authentication.actions";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { getUserVerificationResponse } from "../store/authentication-selector";
import { Observable, of } from "rxjs";
import { VerifyUserInvitationResponse } from "src/app/lib/openapi-generated/models";

@Component({
  selector: "app-verify-user-invitation",
  templateUrl: "./verify-user-invitation.component.html",
  styleUrl: "./verify-user-invitation.component.scss",
})
export class VerifyUserInvitationComponent implements OnInit {
  userVerificationResponse$ = this.store.select(getUserVerificationResponse);
  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.store.dispatch(
        AuthActions.verifyInvitation({
          token: params.token,
        })
      );
    });
  }
}
