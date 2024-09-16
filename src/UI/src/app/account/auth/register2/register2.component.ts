import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

import { Store } from "@ngrx/store";
import { AuthActions } from "../store/authentication.actions";

@Component({
  selector: "app-register2",
  templateUrl: "./register2.component.html",
  styleUrls: ["./register2.component.scss"],
})
export class Register2Component implements OnInit {
  signupForm: UntypedFormGroup;
  submitted: any = false;
  error: any = "";
  successmsg: any = false;

  constructor(private formBuilder: UntypedFormBuilder, public store: Store) {}
  // set the currenr year
  year: number = new Date().getFullYear();

  ngOnInit(): void {
    document.body.classList.add("auth-body-bg");

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

  // swiper config
  slideConfig = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    const email = this.f["email"].value;
    const password = this.f["password"].value;

    //Dispatch Action
    this.store.dispatch(
      AuthActions.register({ email: email, password: password })
    );
  }
}
