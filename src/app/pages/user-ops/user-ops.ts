import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-ops',
  standalone: false,
  templateUrl: './user-ops.html',
  styleUrls: ['./user-ops.css']
})
export class UserOpsPage implements OnInit {
  showModal = false;
  device = '';
  patient = '';
  saving = false;
  actionError = '';
  unregistered: string[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUnregistered();
  }

  openModal(dev?: string, pat?: string) {
    this.device = dev || '';
    this.patient = pat || '';
    this.actionError = '';
    this.showModal = true;
  }

  closeModal() { this.showModal = false; }

  saveMapping() {
    if (!this.device) { this.actionError = 'Device is required'; return; }
    this.saving = true;
    this.actionError = '';
    this.api.ddbPutDeviceMapping(this.device, { patient: this.patient || '' }).subscribe({
      next: () => { this.saving = false; this.showModal = false; this.loadUnregistered(); },
      error: (e) => { console.error('Failed to save mapping', e); this.saving = false; this.actionError = 'Failed to save mapping.'; }
    });
  }

  loadUnregistered() {
    this.api.getUnregisteredDevices().subscribe({
      next: list => this.unregistered = list,
      error: () => this.unregistered = []
    });
  }

   onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }
}
