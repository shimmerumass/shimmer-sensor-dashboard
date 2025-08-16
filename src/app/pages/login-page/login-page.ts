import { Component } from '@angular/core';
import { signOut } from '@aws-amplify/auth';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  async logout() {
    await signOut();
  }
}
