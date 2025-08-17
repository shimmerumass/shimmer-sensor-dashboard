import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FileItem {
  name: string;
  device: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  part?: string | null;
  ext: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://odb777ddnc.execute-api.us-east-2.amazonaws.com';

  constructor(private http: HttpClient) {}

  listFiles(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.baseUrl}/files/metadata/`);
  }

  listFilesParsed(): Observable<FileItem[]> {
    // Backend already returns parsed items; keep method for backwards compatibility
    return this.listFiles();
  }

  getDownloadUrl(filename: string): Observable<{ url: string }> {
    const params = new HttpParams().set('filename', filename);
    return this.http.get<{ url: string }>(`${this.baseUrl}/generate-download-url/`, { params });
  }

  getDownloadAllUrl(): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.baseUrl}/download-all-url/`);
  }

  buildDownloadAllUrl(): string {
    return `${this.baseUrl}/download-all-url/`;
  }

  buildDirectDownloadUrl(filename: string): string {
    return `${this.baseUrl}/download/${encodeURIComponent(filename)}`;
  }

  private parseFileName(name: string): FileItem {
    // Expected pattern: device_YYYYMMDD_HHMMSS_part.ext (part optional)
    const [device = '', ymd = '', hms = '', partExt = ''] = name.split('_');
    const lastDot = name.lastIndexOf('.');
    const ext = lastDot > -1 ? name.substring(lastDot + 1) : '';

    const yyyy = ymd.substring(0, 4);
    const mm = ymd.substring(4, 6);
    const dd = ymd.substring(6, 8);
    const date = yyyy && mm && dd ? `${yyyy}-${mm}-${dd}` : '';

    const hh = hms.substring(0, 2);
    const mi = hms.substring(2, 4);
    const ss = hms.substring(4, 6);
    const time = hh && mi && ss ? `${hh}:${mi}:${ss}` : '';

    const part = partExt?.includes('.') ? partExt.split('.')[0] : undefined;

    return { name, device, date, time, part, ext } as FileItem;
  }
}
