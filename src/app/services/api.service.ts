import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Files {
  time: string;
  ext: string;
  part: string; 
  fullname?: string | null;
}

export interface FileItem {
  device: string;
  date: string; // YYYY-MM-DD
  patient?: string | null;
  files: Files[];
}

export interface DevicePatientRecord {
  device: string;
  patient?: string | null;
  updatedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'https://odb777ddnc.execute-api.us-east-2.amazonaws.com';

  constructor(private http: HttpClient) {}

  // Raw filenames (legacy)
  listFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/files/`);
  }

  // New: rich metadata objects
  listFilesMetadata(): Observable<FileItem[]> {
    return this.http.get<FileItem[]>(`${this.baseUrl}/files/metadata/`);
  }

  // Back-compat for callers
  listFilesParsed(): Observable<FileItem[]> {
    return this.listFilesMetadata();
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

  deleteFile(filename: string): Observable<void> {
    const params = new HttpParams().set('filename', filename);
    return this.http.delete<void>(`${this.baseUrl}/files/`, { params });
  }

  // DDB endpoints
  ddbGetDevicePatientMap(): Observable<DevicePatientRecord[]> {
    return this.http.get<DevicePatientRecord[]>(`${this.baseUrl}/ddb/device-patient-map`);
  }

  ddbPutDevicePatientMap(mapping: Record<string, string>): Observable<DevicePatientRecord[]> {
    return this.http.put<DevicePatientRecord[]>(`${this.baseUrl}/ddb/device-patient-map`, mapping);
    }

  ddbGetDevicePatientMapDetails(): Observable<DevicePatientRecord[]> {
    return this.http.get<DevicePatientRecord[]>(`${this.baseUrl}/ddb/device-patient-map/details`);
  }

  ddbGetDeviceMapping(device: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ddb/device-patient-map/${encodeURIComponent(device)}`);
  }

  ddbPutDeviceMapping(device: string, payload: Record<string, string>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/ddb/device-patient-map/${encodeURIComponent(device)}`, payload);
  }

  ddbDeleteDeviceMapping(device: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/ddb/device-patient-map/${encodeURIComponent(device)}`);
  }

  getUnregisteredDevices(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/devices/unregistered`);
  }

  listUniquePatients(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/patients`);
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

    const files: Files[] = [{
      time,
      ext,
      part: part ?? '',
      fullname: name
    }];

    return {
      device,
      date,
      files
    };
  }

  decodeFile(filename: string) {
    return this.http.get<any>(
      `https://odb777ddnc.execute-api.us-east-2.amazonaws.com/file/decode/?filename=${encodeURIComponent(filename)}`
    );
  }
}
