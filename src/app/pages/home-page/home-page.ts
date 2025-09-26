import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';
import { ApiService, FileItem } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  public activeSensors = 0;
  public expectedSensors = 4; // Preset expected number of devices
  public usersCount = 0;
  patients$!: Observable<string[]>;

  // Data points metrics
  public dataPointsTotal = 0;
  public dataPointsRecentPercent = 0;

  // New: unregistered devices count
  public unregisteredCount = 0;

  constructor(private router: Router, private api: ApiService) {}

  async checkAuth() {
    try {
      const session = await fetchAuthSession();
      const isAuth = session?.tokens?.idToken ? true : false;
      if (!isAuth) this.router.navigate(['/login']);
    } catch {
      this.router.navigate(['/login']);
    }
  }

  private loadActiveSensors() {
    this.patients$ = this.api.listUniquePatients();
    this.api.listUniquePatients().subscribe({
      next: (patients) => {
        const count = Array.isArray(patients) ? patients.length : 0;
        this.usersCount = count;
      },
      error: () => { this.usersCount = 0; }
    });
    
    // Load active sensors from metadata
    this.api.listFilesMetadata().subscribe({
      next: (response: any) => {
        const items = Array.isArray(response?.data) ? response.data : [];
        
        // Count unique devices from the metadata
        const uniqueDevices = new Set();
        items.forEach((row: any) => {
          if (row?.device) {
            uniqueDevices.add(row.device);
          }
        });
        
        this.activeSensors = uniqueDevices.size;
        console.log(`Active sensors: ${this.activeSensors}, Expected: ${this.expectedSensors}`);
      },
      error: () => { this.activeSensors = 0; }
    });
  }

  private loadDataPoints() {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    this.api.listFilesMetadata().subscribe({
      next: (response: any) => {
        const items = Array.isArray(response?.data) ? response.data : [];
        console.log('Files data:', items.slice(0, 2)); // Debug: log first 2 items
        
        // Count all individual files, not just rows
        let allFiles: any[] = [];
        items.forEach((row: any) => {
          const rowFiles = row?.files;
          if (rowFiles && Array.isArray(rowFiles)) {
            allFiles = allFiles.concat(rowFiles);
          }
        });
        
        console.log(`Total individual files found: ${allFiles.length}`);
        
        this.dataPointsTotal = allFiles.length;
        
        const recent = allFiles.filter(f => {
          // Extract date from timestamp format: 20250827_013909 or 20250904_003502
          const timestamp = f?.timestamp || '';
          
          if (!timestamp || timestamp === 'files.zip') return false;
          
          // Parse timestamp YYYYMMDD_HHMMSS
          const dateMatch = timestamp.match(/^(\d{4})(\d{2})(\d{2})_/);
          if (!dateMatch) return false;
          
          const year = parseInt(dateMatch[1]);
          const month = parseInt(dateMatch[2]) - 1; // months are 0-based
          const day = parseInt(dateMatch[3]);
          const dt = new Date(year, month, day);
          
          return !isNaN(dt.getTime()) && dt >= cutoff;
        }).length;
        
        this.dataPointsRecentPercent = this.dataPointsTotal ? Math.round((recent / this.dataPointsTotal) * 100) : 0;
        console.log(`Total files: ${this.dataPointsTotal}, Recent files: ${recent}, Percent: ${this.dataPointsRecentPercent}`);
      },
      error: () => { this.dataPointsTotal = 0; this.dataPointsRecentPercent = 0; }
    });
  }

  private loadUnregisteredCount() {
    this.api.getUnregisteredDevices().subscribe({
      next: (list) => {
        this.unregisteredCount = Array.isArray(list) ? list.length : 0;
      },
      error: () => { this.unregisteredCount = 0; }
    });
  }

  ngOnInit(): void {
    this.checkAuth();
    this.loadActiveSensors();
    this.loadDataPoints();
    this.loadUnregisteredCount();
  }

  onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }

  openGraphModal(data: { shimmer1?: any[]; shimmer2?: any[] }) {
    console.log('Graph Button Output:', {
      shimmer1: data.shimmer1,
      shimmer2: data.shimmer2
    });
    // Optionally set modal state if you want to show the arrays in the UI
    // this.graphModalData = data;
    // this.showGraphModal = true;
  }
}
