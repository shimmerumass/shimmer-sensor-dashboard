import { Component } from '@angular/core';
import { signOut, fetchAuthSession } from '@aws-amplify/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  isAuthenticated = false;

  constructor(private router: Router) {
    this.checkAuth();
  }

  async checkAuth() {
    try {
      const session = await fetchAuthSession();
      this.isAuthenticated = session?.tokens?.idToken ? true : false;
      if (this.isAuthenticated) {
        this.router.navigate(['/home']);
      }
    } catch {
      this.isAuthenticated = false;
    }
  }

  onAuthSuccess() {

    console.log("SUCCESSS")
    this.router.navigate(['/home']);
  }
}
