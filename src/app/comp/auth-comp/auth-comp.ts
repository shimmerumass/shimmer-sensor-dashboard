import { Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticatorService } from '@aws-amplify/ui-angular';

@Component({
  selector: 'app-auth-comp',
  standalone: false,
  templateUrl: './auth-comp.html',
  styleUrls: ['./auth-comp.css']
})
export class AuthComp implements OnDestroy {
  @Output() authSuccess = new EventEmitter<void>();
  private authCheckInterval: any;

  constructor(public authenticator: AuthenticatorService, private router: Router) {
    this.authCheckInterval = setInterval(() => {
      if (this.authenticator.authStatus === 'authenticated') {
        this.router.navigate(['/home']);
        // window.location.reload();
        clearInterval(this.authCheckInterval);
      }
    }, 300);
  }

  // Call this method after successful login/signup
  onAuthComplete() {
    this.authSuccess.emit();
  }

  ngOnDestroy() {
    if (this.authCheckInterval) {
      clearInterval(this.authCheckInterval);
    }
  }
}
