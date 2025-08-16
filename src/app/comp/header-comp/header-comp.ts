import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-comp',
  standalone: false,
  templateUrl: './header-comp.html',
  styleUrls: ['./header-comp.css']
})
export class HeaderComp {

  constructor(private router: Router) {
  }

}

