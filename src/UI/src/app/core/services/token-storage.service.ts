import { Injectable } from '@angular/core';

const TOKEN_KEY = 'token';
// const USER_KEY = 'currentUser';


// TODO: Implement the token storage service or remove it if not needed
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(TOKEN_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}
