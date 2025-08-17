import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://odb777ddnc.execute-api.us-east-2.amazonaws.com';

  constructor(private http: HttpClient) {}

  listFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/files/`);
    }

  getDownloadUrl(filename: string): Observable<{ url: string }> {
    const params = new HttpParams().set('filename', filename);
    return this.http.get<{ url: string }>(`${this.baseUrl}/generate-download-url/`, { params });
  }

  getDownloadAllUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/download-all-url/`);
  }
}
