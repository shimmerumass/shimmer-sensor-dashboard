import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  @Output() updateRequested = new EventEmitter<DevicePatientRecord>();
  @Output() deleteRequested = new EventEmitter<DevicePatientRecord>();
  @Output() changed = new EventEmitter<{ action: 'delete'; device: string; ok: boolean; error?: string }>();

  columnDefs: ColDef[] = [
  { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
  { headerName: 'Patient', field: 'patient', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
  { 
    headerName: 'Left Shimmers', 
    field: 'shimmer1', 
    filter: 'agTextColumnFilter', 
    sortable: true, 
    flex: 1,
    cellRenderer: (params: any) => {
      if (!params.value) return '';
      const items = Array.isArray(params.value) ? params.value : [];
      if (items.length === 0) return '';
      return items.map((item: string) => `<div style="padding: 2px 0;">${item}</div>`).join('');
    },
    cellStyle: { 
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.5',
      padding: '8px'
    },
    autoHeight: true
  },
  { 
    headerName: 'Right Shimmers', 
    field: 'shimmer2', 
    filter: 'agTextColumnFilter', 
    sortable: true, 
    flex: 1,
    cellRenderer: (params: any) => {
      if (!params.value) return '';
      const items = Array.isArray(params.value) ? params.value : [];
      if (items.length === 0) return '';
      return items.map((item: string) => `<div style="padding: 2px 0;">${item}</div>`).join('');
    },
    cellStyle: { 
      whiteSpace: 'normal',
      wordWrap: 'break-word',
      lineHeight: '1.5',
      padding: '8px'
    },
    autoHeight: true
  },
  // { headerName: 'Updated At', field: 'updatedAt', filter: 'agDateColumnFilter', sortable: true, flex: 1 },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 150,
      sortable: false,
      filter: false,
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      cellRenderer: () => `
        <div style="display:flex; justify-content:center; align-items:center; gap:6px; width:100%; height:100%;">
          <button type="button" class="ag-action-btn ag-action-icon update" title="Update mapping">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </button>
          <button type="button" class="ag-action-btn ag-action-icon delete" title="Delete mapping">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      `
    }
  ];

  defaultColDef: ColDef = { resizable: true, filter: true, sortable: true, floatingFilter: true };

  rowData: DevicePatientRecord[] = [];
  quickFilterText = '';
  isLoading = false;
  loadError = '';
  actionError = '';

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

  onCellClicked(event: any) {
    if (event.colDef.field !== 'actions') return;
    const targetBtn = (event.event?.target as HTMLElement)?.closest('button');
    if (!targetBtn) return;
    const rec = event.data as DevicePatientRecord;
    this.actionError = '';
    if (targetBtn.classList.contains('update')) {
      this.updateRequested.emit(rec);
      return;
    }
    if (targetBtn.classList.contains('delete')) {
      this.deleteRequested.emit(rec);
      return;
    }
  }
}
