import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, DevicePatientRecord } from '../../services/api.service';
import { UserGridComponent } from '../../comp/user-grid/user-grid';

@Component({
  selector: 'app-user-ops',
  standalone: false,
  templateUrl: './user-ops.html',
  styleUrls: ['./user-ops.css']
})
export class UserOpsPage implements OnInit {
  @ViewChild(UserGridComponent) grid?: UserGridComponent;

  showModal = false;
  device = '';
  patient = '';
  readonlyDevice = false;
  saving = false;
  actionError = '';
  unregistered: string[] = [];

  // notifications
  notifMessage = '';
  notifType: 'success' | 'error' = 'success';
  private notifTimer?: any;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadUnregistered();
  }

  openModal(dev?: string, pat?: string) {
    this.device = dev || '';
    this.patient = pat || '';
    this.readonlyDevice = !!dev; // make device static when editing a selected device
    this.actionError = '';
    this.showModal = true;
  }

  onUpdate(rec: DevicePatientRecord) {
    this.openModal(rec.device, rec.patient || '');
  }

  onGridChanged(evt: { action: 'delete'; device: string; ok: boolean; error?: string }) {
    if (evt.ok) {
      this.toast(`Deleted mapping for ${evt.device}`, 'success');
      this.loadUnregistered();
      this.grid?.reload();
    } else {
      this.toast(evt.error || 'Operation failed', 'error');
    }
  }

  closeModal() { this.showModal = false; this.readonlyDevice = false; }

  saveMapping() {
    if (!this.device) { this.actionError = 'Device is required'; return; }
    this.saving = true;
    this.actionError = '';
    this.api.ddbPutDeviceMapping(this.device, { patient: this.patient || '' }).subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.readonlyDevice = false;
        this.toast('Mapping saved', 'success');
        this.grid?.reload();
        this.loadUnregistered();
      },
      error: (e) => {
        console.error('Failed to save mapping', e);
        this.saving = false;
        this.actionError = 'Failed to save mapping.';
        this.toast('Failed to save mapping.', 'error');
      }
    });
  }

  loadUnregistered() {
    this.api.getUnregisteredDevices().subscribe({
      next: list => this.unregistered = list,
      error: () => this.unregistered = []
    });
  }

  private toast(msg: string, type: 'success' | 'error') {
    this.notifMessage = msg;
    this.notifType = type;
    if (this.notifTimer) clearTimeout(this.notifTimer);
    this.notifTimer = setTimeout(() => { this.notifMessage = ''; }, 3000);
  }

  onLogout() {
    console.log('Logout event received from header component');
    // Handle any additional logout logic here
  }
}
