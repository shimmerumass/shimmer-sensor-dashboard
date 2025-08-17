import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  public activeSensors = 0;
  patients$!: Observable<string[]>;

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
        this.activeSensors = count * 2;
      },
      error: () => { this.activeSensors = 0; }
    });
  }

  ngOnInit(): void {
    this.checkAuth();
    this.loadActiveSensors();
  }

  onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }
}
