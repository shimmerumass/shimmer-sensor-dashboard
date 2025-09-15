import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-data-ops',
  standalone: false,
  templateUrl: './data-ops.html',
  styleUrls: ['./data-ops.css']
})
export class DataOps implements OnInit {
  // Modal state for future features
  showModal = false;
  notifMessage = '';
  notifType: 'success' | 'error' = 'success';
  private notifTimer?: any;

  constructor(private api: ApiService, private router: Router) {}

  async checkAuth() {
    try {
      const session = await fetchAuthSession();
      const isAuth = session?.tokens?.idToken ? true : false;
      if (!isAuth) this.router.navigate(['/login']);
    } catch {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.checkAuth();
    // Add any data loading logic here if needed
  }

  onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }

  // Notification logic for future actions
  private toast(msg: string, type: 'success' | 'error') {
    this.notifMessage = msg;
    this.notifType = type;
    if (this.notifTimer) clearTimeout(this.notifTimer);
    this.notifTimer = setTimeout(() => { this.notifMessage = ''; }, 3000);
  }
}

