import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage {
  constructor(private router: Router) {}

  onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }
}
