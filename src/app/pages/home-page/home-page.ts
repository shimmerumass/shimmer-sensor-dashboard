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
        this.activeSensors = count * 2;
      },
      error: () => { this.usersCount = 0; this.activeSensors = 0; }
    });
  }

  private loadDataPoints() {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    this.api.listFilesMetadata().subscribe({
      next: (files: FileItem[]) => {
        const items = Array.isArray(files) ? files : [];
        this.dataPointsTotal = items.length;
        const recent = items.filter(f => {
          const dStr = f?.date || '';
          if (!dStr) return false;
          const dt = new Date(`${dStr}`);
          return !isNaN(dt.getTime()) && dt >= cutoff;
        }).length;
        this.dataPointsRecentPercent = this.dataPointsTotal ? Math.round((recent / this.dataPointsTotal) * 100) : 0;
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
}
