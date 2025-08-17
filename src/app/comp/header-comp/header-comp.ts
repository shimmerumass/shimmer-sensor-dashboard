import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from '@aws-amplify/auth';

@Component({
  selector: 'app-header-comp',
  standalone: false,
  templateUrl: './header-comp.html',
  styleUrls: ['./header-comp.css']
})
export class HeaderComp {
  @Output() logoutEvent = new EventEmitter<void>();

  constructor(private router: Router) {
  }

  async logout() {
    await signOut();
    this.logoutEvent.emit();
    this.router.navigate(['/']);
  }
}

