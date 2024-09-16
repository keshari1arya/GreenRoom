import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class UserProfileService {
  constructor(private http: HttpClient) {}
  /***
   * Get All User
   */
  getAll() {
    return this.http.get<any[]>(`api/users`);
  }

  /***
   * Facked User Register
   */
  register(user: any) {
    return this.http.post(`/users/register`, user);
  }
}
