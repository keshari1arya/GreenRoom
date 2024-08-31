import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import AuthService from 'src/app/core/services/auth.service';
import { PostApiUsersLogin$Params } from 'src/app/lib/openapi-generated/fn/users/post-api-users-login';
import { UsersService } from 'src/app/lib/openapi-generated/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  loginForm = this.formBuilder.group({
    username: [''],
    password: [''],
  });

  onSubmit() {
    console.log(this.loginForm.value);

    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(
      this.loginForm.value.username!,
      this.loginForm.value.password!
    );
  }
}
