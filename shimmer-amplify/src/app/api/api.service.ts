import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS } from './api-urls.constants';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    // Placeholder GET request
    return this.http.get(API_URLS.GET_DATA);
  }

  postData(payload: any): Observable<any> {
    // Placeholder POST request
    return this.http.post(API_URLS.POST_DATA, payload);
  }
}
