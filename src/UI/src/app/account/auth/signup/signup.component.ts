import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import { AuthActions } from "../store/authentication.actions";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: UntypedFormGroup;
  submitted: any = false;
  error: any = "";
  successmsg: any = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, public store: Store) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      confirmPassword: [
        "",
        Validators.required,
        // TODO: validate that the password and confirm password match
      ],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.signupForm.controls;
  }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid

    const email = this.f["email"].value;
    const password = this.f["password"].value;

    //Dispatch Action
    this.store.dispatch(
      AuthActions.register({ email: email, password: password })
    );
  }
}
