import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private apiUrl = 'https://localhost:5001/api/Subscription';

  constructor(
    private http: HttpClient
  ) { }

  getSubscription(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

}
