import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ApiService, FileItem } from '../../services/api.service';

@Component({
  selector: 'app-files-grid',
  standalone: false,
  templateUrl: './files-grid.html',
  styleUrls: ['./files-grid.css']
})
export class FilesGrid implements OnInit {
  columnDefs: ColDef[] = [
    { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
    { headerName: 'Date', field: 'date', filter: 'agTextColumnFilter', sortable: true, flex: 1 },
    { headerName: 'Time', field: 'time', filter: 'agTextColumnFilter', sortable: true, width: 130 },
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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    console.log("Fetching file data...");
    this.api.listFilesParsed().subscribe(items => (this.rowData = items));
  }

  onQuickFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.quickFilterText = input?.value ?? '';
  }

  onPageSizeChange(event: Event) {
    const val = Number((event.target as HTMLSelectElement).value);
    this.pageSize = val;
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
