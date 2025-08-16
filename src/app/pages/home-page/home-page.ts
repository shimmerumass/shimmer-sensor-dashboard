import { Component } from '@angular/core';
import { signOut } from '@aws-amplify/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone:  false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {
  constructor(private router: Router) {}

  async logout() {
    await signOut();
    this.router.navigate(['/']);
  }
}
