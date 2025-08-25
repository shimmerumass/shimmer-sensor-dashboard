import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent, IHeaderComp, IHeaderParams } from 'ag-grid-community';
import { ApiService, FileItem } from '../../services/api.service';

class ClearFilterHeader implements IHeaderComp {
  private eGui!: HTMLElement;
  private btn!: HTMLButtonElement;
  private params!: IHeaderParams;
  private clickHandler!: () => void;

  init(params: IHeaderParams): void {
    this.params = params;
    const eGui = document.createElement('div');
    eGui.style.display = 'flex';
    eGui.style.alignItems = 'center';
    eGui.style.gap = '6px';

    const label = document.createElement('span');
    label.textContent = params.displayName ?? params.column.getColId();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ag-hdr-clear-btn';
    btn.title = 'Clear filter';
    btn.setAttribute('aria-label', 'Clear filter');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    this.clickHandler = () => {
      const api = this.params.api;
      const colId = this.params.column.getColId();
      const model = (api.getFilterModel() || {}) as any;
      model[colId] = null; // set to null so floating filter UI also clears
      api.setFilterModel(model);
      // notify host component to sync toolbar inputs
      const ctx: any = this.params.context;
      if (ctx && typeof ctx.onClear === 'function') {
        ctx.onClear(colId);
      }
    };

    btn.addEventListener('click', this.clickHandler);

    eGui.appendChild(label);
    eGui.appendChild(btn);

    this.eGui = eGui;
    this.btn = btn;
  }

  getGui(): HTMLElement { return this.eGui; }
  destroy(): void { this.btn?.removeEventListener('click', this.clickHandler); }
  refresh(params: IHeaderParams): boolean { this.params = params; return true; }
}

@Component({
  selector: 'app-files-grid',
  standalone: false,
  templateUrl: './files-grid.html',
  styleUrls: ['./files-grid.css']
})
export class FilesGrid implements OnInit {
  private gridApi?: GridApi;
  components = { clearFilterHeader: ClearFilterHeader };
  context = { onClear: (colId: string) => this.onHeaderClear(colId) };

  private static parseTimeToSeconds(t?: string): number {
    if (!t) return 0;
    const m = t.match(/^(\d{2}):(\d{2}):(\d{2})$/);
    if (!m) return 0;
    const hh = Number(m[1]);
    const mm = Number(m[2]);
    const ss = Number(m[3]);
    return (hh || 0) * 3600 + (mm || 0) * 60 + (ss || 0);
  }

  private static compareYyyyMmDd(filterDate: Date, cellValue?: string): number {
    if (!cellValue) return -1;
    const [y, m, d] = cellValue.split('-').map(Number);
    const cellDate = new Date(y, (m || 1) - 1, d || 1);
    const fd = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate());
    const cd = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
    if (cd < fd) return -1;
    if (cd > fd) return 1;
    return 0;
  }

  columnDefs: ColDef[] = [
    { headerName: 'Patient', field: 'patient', headerComponent: 'clearFilterHeader', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
    { headerName: 'Device', field: 'device', headerComponent: 'clearFilterHeader', filter: 'agTextColumnFilter', sortable: true, flex: 1, hide: false, valueGetter: params => params.data?.device },
    {
      headerName: 'Date',
      field: 'date',
      headerComponent: 'clearFilterHeader',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) =>
          FilesGrid.compareYyyyMmDd(filterLocalDateAtMidnight, cellValue),
        browserDatePicker: true
      },
      sortable: true,
      flex: 1
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      cellRenderer: () => `
        <button type="button" class="ag-action-btn ag-action-icon" aria-label="Download">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      `,
      sortable: false,
      filter: false
    }
  ];

  defaultColDef: ColDef = { resizable: true, filter: true, sortable: true, floatingFilter: true };

  rowData: FileItem[] = [];
  quickFilterText = '';

  pageSize = 25;
  pageSizeOptions = [10, 25, 50, 100];

  timeFrom = '';
  timeTo = '';
  isDownloadingAll = false;
  downloadAllUrl = '';

  // Error handling state
  isLoading = false;
  loadError = '';
  actionError = '';

  // Patient toolbar filter
  selectedPatient = '';
  get uniquePatients(): string[] {
    const s = new Set<string>();
    for (const r of this.rowData) {
      if (r.patient) s.add(r.patient);
    }
    return Array.from(s).sort();
  }

  private readonly downloadBase: string = 'https://odb777ddnc.execute-api.us-east-2.amazonaws.com/download/';

  // Global screen loader flag
  isScreenLoading = false;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.api.listFilesParsed().subscribe({
      next: (resp: any) => {
        this.rowData = Array.isArray(resp?.data) ? resp.data : [];
        console.log('FilesGrid rowData:', this.rowData);
        this.loadError = '';
        this.isLoading = false;
      },
      error: err => {
        console.error('Failed to load files', err);
        this.rowData = [];
        this.loadError = 'Failed to load files. Please try again.';
        this.isLoading = false;
      }
    });
  }

  onGridReady(e: GridReadyEvent) {
    this.gridApi = e.api;
  }

  onQuickFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.quickFilterText = input?.value ?? '';
  }

  onPageSizeChange(event: Event) {
    const val = Number((event.target as HTMLSelectElement).value);
    this.pageSize = val;
  }

  applyTimeRangeFilter() {
    if (!this.gridApi) return;
    const fromSec = FilesGrid.parseTimeToSeconds(this.timeFrom);
    const toSec = FilesGrid.parseTimeToSeconds(this.timeTo);
    if (!fromSec && !toSec) {
      this.clearColumnFilter('time');
      return;
    }
    const model = { filterType: 'number', type: 'inRange', filter: fromSec || 0, filterTo: toSec || 86399 } as any;
    const fm = this.gridApi.getFilterModel() || {};
    (fm as any)['time'] = model;
    this.gridApi.setFilterModel(fm);
  }

  applyPatientFilter() {
    if (!this.gridApi) return;
    const fm = (this.gridApi.getFilterModel() || {}) as any;
    if (!this.selectedPatient) {
      delete fm['patient'];
      this.gridApi.setFilterModel(Object.keys(fm).length ? fm : null);
      return;
    }
    fm['patient'] = { filterType: 'set', values: [this.selectedPatient] };
    this.gridApi.setFilterModel(fm);
  }

  clearColumnFilter(colKey: string) {
    if (!this.gridApi) return;
    const fm = (this.gridApi.getFilterModel() || {}) as any;
    fm[colKey] = null; // set to null to fully reset including floating filter UI
    this.gridApi.setFilterModel(fm);
  }

  clearTimeFilter() {
    this.timeFrom = '';
    this.timeTo = '';
    this.clearColumnFilter('time');
  }

  clearDateFilter() {
    this.clearColumnFilter('date');
  }

  clearAllFilters() {
    if (!this.gridApi) return;
    this.gridApi.setFilterModel(null);
    this.timeFrom = '';
    this.timeTo = '';
    this.selectedPatient = '';
  }
  
  // Stream download helper: keeps loader active until the file finishes downloading
  private async streamDownload(url: string, filenameHint?: string) {
    try {
      const resp = await fetch(url, { credentials: 'include', mode: 'cors' as RequestMode });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);

      const blob = await resp.blob();
      const cd = resp.headers.get('content-disposition') || '';
      const suggested = this.getFilenameFromContentDisposition(cd) || filenameHint || 'download';
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = suggested;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (e) {
      console.error('Stream download failed, falling back to navigation', e);
      try { window.location.href = url; } catch {}
    } finally {
      this.isScreenLoading = false;
      this.isDownloadingAll = false;
    }
  }

  private getFilenameFromContentDisposition(cd: string): string | null {
    try {
      const m = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
      if (!m) return null;
      const fn = decodeURIComponent(m[1] || m[2]);
      return fn || null;
    } catch { return null; }
  }

  onCellClicked(event: any) {
    if (event.colDef.field !== 'actions') return;
    const files = event.data?.files;
    if (!Array.isArray(files) || !files.length) return;
    this.actionError = '';
    this.isScreenLoading = true;
    this.downloadZipByUserDate(files);
  }

  private downloadZipByUserDate(files: any[]) {
    fetch('https://odb777ddnc.execute-api.us-east-2.amazonaws.com/download-zip-by-user-date/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'application/json' },
      body: JSON.stringify(files)
    })
      .then(resp => resp.json())
      .then(data => {
        if (data?.download_url) {
          window.open(data.download_url, '_blank');
        } else {
          this.actionError = 'Download URL not received.';
        }
        this.isScreenLoading = false;
      })
      .catch(err => {
        console.error('Failed to get zip download URL', err);
        this.actionError = 'Failed to start download. Please try again.';
        this.isScreenLoading = false;
      });
  }

  downloadAll() {
    if (this.isDownloadingAll) {
      return;
    }
    this.isDownloadingAll = true;
    this.isScreenLoading = true;
    this.downloadAllUrl = '';
    this.actionError = '';
    this.api.getDownloadAllUrl().subscribe({
      next: ({ url }) => {
        const target = url || this.api.buildDownloadAllUrl();
        this.downloadAllUrl = target;
        // Keep loader until the bulk file is fully received
        void this.streamDownload(target, 'shimmer-files.zip');
      },
      error: (e) => {
        console.error('Failed to get download-all URL', e);
        this.isDownloadingAll = false;
        this.isScreenLoading = false;
        this.downloadAllUrl = this.api.buildDownloadAllUrl();
        this.actionError = 'Could not generate a pre-signed URL.';
      }
    });
  }

  onHeaderClear(colId: string) {
    if (!this.gridApi) return;
    const fm = (this.gridApi.getFilterModel() || {}) as any;
    fm[colId] = null;
    this.gridApi.setFilterModel(fm);
    if (colId === 'patient') this.selectedPatient = '';
    if (colId === 'time') { this.timeFrom = ''; this.timeTo = ''; }
  }
}
