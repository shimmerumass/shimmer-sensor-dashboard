import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    // Replace with your API endpoint
    return this.http.get('https://jsonplaceholder.typicode.com/todos/1');
  }
}
