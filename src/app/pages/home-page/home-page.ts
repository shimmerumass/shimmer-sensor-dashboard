import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}

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
  }

  onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }
}
