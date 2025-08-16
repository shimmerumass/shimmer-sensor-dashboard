import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  private readonly ADMIN_USER = 'admin';
  private readonly ADMIN_PASS = 'password123';

  constructor(private router: Router) {}

  login() {
    if (this.username === this.ADMIN_USER && this.password === this.ADMIN_PASS) {
      this.error = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.error = 'Invalid credentials';
    }
  }
}
