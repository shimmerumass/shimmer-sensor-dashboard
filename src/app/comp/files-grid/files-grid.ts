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
    { headerName: 'Part', field: 'part', filter: 'agTextColumnFilter', width: 110 },
    { headerName: 'Ext', field: 'ext', filter: 'agTextColumnFilter', width: 110 },
    { headerName: 'File Name', field: 'name', filter: 'agTextColumnFilter', flex: 2 }
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
}
