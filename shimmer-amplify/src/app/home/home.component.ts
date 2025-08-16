import { Component } from '@angular/core';
import { ApiService } from '../api/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  data: any;

  constructor(private apiService: ApiService) {}

  fetchData() {
    this.apiService.getData().subscribe((response) => {
      this.data = response;
    });
  }
}
