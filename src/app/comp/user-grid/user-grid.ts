import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ApiService, DevicePatientRecord } from '../../services/api.service';

@Component({
  selector: 'app-user-grid',
  standalone: false,
  templateUrl: './user-grid.html',
  styleUrls: ['./user-grid.css']
})
export class UserGridComponent implements OnInit {
  private gridApi?: GridApi;

  columnDefs: ColDef[] = [
    { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
    { headerName: 'Patient', field: 'patient', filter: 'agSetColumnFilter', sortable: true, flex: 1 },
    { headerName: 'Updated At', field: 'updatedAt', filter: 'agDateColumnFilter', sortable: true, flex: 1 }
  ];

  defaultColDef: ColDef = { resizable: true, filter: true, sortable: true, floatingFilter: true };

  rowData: DevicePatientRecord[] = [];
  quickFilterText = '';
  isLoading = false;
  loadError = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.isLoading = true;
    this.api.ddbGetDevicePatientMapDetails().subscribe({
      next: recs => { this.rowData = recs; this.loadError = ''; this.isLoading = false; },
      error: err => { console.error('Failed to load records', err); this.rowData = []; this.loadError = 'Failed to load records.'; this.isLoading = false; }
    });
  }

  onGridReady(e: GridReadyEvent) { this.gridApi = e.api; }

  onQuickFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.quickFilterText = input?.value ?? '';
  }
}
