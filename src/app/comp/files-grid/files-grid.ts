import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ApiService, FileItem } from '../../services/api.service';

@Component({
  selector: 'app-files-grid',
  standalone: false,
  templateUrl: './files-grid.html',
  styleUrls: ['./files-grid.css']
})
export class FilesGrid implements OnInit {
  private gridApi?: GridApi;

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
    { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
    {
      headerName: 'Date',
      field: 'date',
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
      headerName: 'Time',
      field: 'time',
      filter: 'agNumberColumnFilter',
      filterParams: { filterOptions: ['inRange', 'greaterThan', 'lessThan', 'equals'] },
      sortable: true,
      width: 130,
      valueGetter: params => FilesGrid.parseTimeToSeconds(params.data?.time),
      valueFormatter: params => params.data?.time ?? ''
    },
    { headerName: 'File Name', field: 'part', filter: 'agTextColumnFilter', width: 110 },
    { headerName: 'Ext', field: 'ext', filter: 'agTextColumnFilter', width: 110, hide: true },
    { headerName: 'Full Name', field: 'name', filter: 'agTextColumnFilter', flex: 2, hide: true },
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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    console.log('Fetching file data...');
    this.api.listFilesParsed().subscribe(items => (this.rowData = items));
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
      this.gridApi.setFilterModel({ ...this.gridApi.getFilterModel(), time: null });
      return;
    }
    const model = { filterType: 'number', type: 'inRange', filter: fromSec || 0, filterTo: toSec || 86399 } as any;
    const fm = this.gridApi.getFilterModel() || {};
    (fm as any)['time'] = model;
    this.gridApi.setFilterModel(fm);
  }

  onCellClicked(event: any) {
    if (event.colDef.field === 'actions') {
      const filename = event.data?.name;
      if (!filename) return;
      const url = this.api.buildDirectDownloadUrl(filename);
      window.open(url, '_blank');
    }
  }
}
