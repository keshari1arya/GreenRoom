import { Component, OnInit } from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { AuthActions } from "../store/authentication.actions";
import { Observable, of } from "rxjs";
import { getError } from "../store/authentication-selector";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  providers: [FormsModule, ReactiveFormsModule],
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  submitted: any = false;
  error$: Observable<string> = of("");
  returnUrl: string;
  fieldTextType!: boolean;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private store: Store
  ) {
    this.loginForm = this.formBuilder.group({
      email: [
        "administrator@localhost.com",
        [Validators.required, Validators.email],
      ],
      password: ["Administrator1!", [Validators.required]],
    });
  }

  ngOnInit() {
    this.error$ = this.store.select(getError);
    if (localStorage.getItem("currentUser")) {
      // this.router.navigate(["/"]);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    const email = this.f["email"].value; // Get the username from the form
    const password = this.f["password"].value; // Get the password from the form

    if (this.loginForm.valid) {
      this.store.dispatch(
        AuthActions.login({ email: email, password: password })
      );
    }
  }

  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
