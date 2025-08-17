import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';
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

  // delete confirmation
  pendingDelete?: DevicePatientRecord | null;
  deleting = false;

  constructor(private api: ApiService, private router: Router) {}

  async checkAuth() {
    try {
      const session = await fetchAuthSession();
      const isAuth = session?.tokens?.idToken ? true : false;
      if (!isAuth) this.router.navigate(['/login']);
    } catch {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    this.checkAuth();
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

  onDeleteRequest(rec: DevicePatientRecord) {
    this.pendingDelete = rec;
  }

  cancelDelete() { this.pendingDelete = null; }

  confirmDelete() {
    if (!this.pendingDelete) return;
    const device = this.pendingDelete.device;
    this.deleting = true;
    this.api.ddbDeleteDeviceMapping(device).subscribe({
      next: () => {
        this.deleting = false;
        this.pendingDelete = null;
        this.toast(`Deleted mapping for ${device}`, 'success');
        this.grid?.reload();
        this.loadUnregistered();
      },
      error: (e) => {
        console.error('Failed to delete mapping', e);
        this.deleting = false;
        this.toast('Delete failed. Please try again.', 'error');
      }
    });
  }
}
