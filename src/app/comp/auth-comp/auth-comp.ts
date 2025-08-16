import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auth-comp',
  standalone: false,
  templateUrl: './auth-comp.html',
  styleUrls: ['./auth-comp.css']
})
export class AuthComp {
  @Output() authSuccess = new EventEmitter<void>();

  // Call this method after successful login/signup
  onAuthComplete() {
    this.authSuccess.emit();
  }
}
