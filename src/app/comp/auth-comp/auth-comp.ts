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
  private routeCheckInterval: any;

  constructor(public authenticator: AuthenticatorService, private router: Router) {
    this.routeCheckInterval = setInterval(() => {
      if (this.authenticator.route === 'authenticated') {
        this.router.navigate(['/dashboard']);
        // window.location.reload();
        clearInterval(this.routeCheckInterval);
      }
    }, 300);
  }

  // Call this method after successful login/signup
  onAuthComplete() {
    this.authSuccess.emit();
  }

  ngOnDestroy() {
    if (this.routeCheckInterval) {
      clearInterval(this.routeCheckInterval);
    }
  }
}
