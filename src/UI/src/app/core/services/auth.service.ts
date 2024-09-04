import { Injectable } from '@angular/core';

import { getFirebaseBackend } from '../../authUtils';
import { User } from 'src/app/store/Authentication/auth.models';
import { from, map } from 'rxjs';
import { UsersService } from 'src/app/lib/openapi-generated/services';
import { AccessTokenResponse } from 'src/app/lib/openapi-generated/models';


@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    user: User;

    constructor(private usersService: UsersService) {
    }

    /**
     * Returns the current user
     */
    public token(): string {
        return localStorage.getItem('token');
    }


    /**
     * Performs the auth
     * @param email email of user
     * @param password password of user
     */
    login(email: string, password: string) {
        return from(
            this.usersService.postApiUsersLogin({ body: { email: email, password: password } }).pipe(
                map((response: AccessTokenResponse) => {
                    localStorage.setItem('token', response.accessToken);

                    return response;
                })
            )
        );
    }

    /**
     * Performs the register
     * @param email email
     * @param password password
     */
    register(user: User) {
        // return from(getFirebaseBackend().registerUser(user));

        return from(getFirebaseBackend().registerUser(user).then((response: any) => {
            const user = response;
            return user;
        }));
    }

    /**
     * Reset password
     * @param email email
     */
    resetPassword(email: string) {
        return getFirebaseBackend().forgetPassword(email).then((response: any) => {
            const message = response.data;
            return message;
        });
    }

    /**
     * Logout the user
     */
    logout() {
        // logout the user
        getFirebaseBackend().logout();
    }
}

