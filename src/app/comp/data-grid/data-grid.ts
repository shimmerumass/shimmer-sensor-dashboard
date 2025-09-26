// ...existing imports...
import Chart from 'chart.js/auto';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-grid',
  standalone: false,
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.css'
})
export class DataGrid implements OnInit {
  @Output() graphOutput = new EventEmitter<{ time?: any[]; abs?: any[] }>();
  private chartInstance: Chart | null = null;

  private destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }
  // Modal state for graph plotting
  // Modal/chart logic removed; modal now handled by parent component
  rowData: any[] = [];
  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Patient', field: 'patient', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
    { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
    { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter', sortable: true, minWidth: 120, maxWidth: 140 },
    { headerName: 'Shimmer 1', field: 'shimmer1', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
    { headerName: 'Shimmer 2', field: 'shimmer2', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
    {
      headerName: 'Shimmer 1',
      groupId: 'shimmer1',
      children: [
        { headerName: 'Day', field: 'shimmer1_shimmer_day', filter: 'agTextColumnFilter', sortable: true, minWidth: 80, maxWidth: 100 },
        { headerName: 'Accel Var', field: 'shimmer1_accel_var', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        // { headerName: 'Time', field: 'shimmer1_time', filter: 'agTextColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Full File Name', field: 'shimmer1_full_file_name', filter: 'agTextColumnFilter', sortable: true, minWidth: 220, maxWidth: 320, hide: true },
        { headerName: 'MAC Address', field: 'shimmer1_mac_address', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 180 },
        {
          headerName: '',
          field: 'shimmer1_graph',
          cellRenderer: (params: any) => {
            const hasTime = Array.isArray(params.data.shimmer1_timestamps) && params.data.shimmer1_timestamps.length > 0;
            const hasAbs = Array.isArray(params.data.shimmer1_accel_ln_abs) && params.data.shimmer1_accel_ln_abs.length > 0;
            if (!hasTime || !hasAbs) return '';
            const btn = document.createElement('button');
            btn.className = 'ag-btn ag-btn-graph themed-graph-btn';
            btn.title = 'Show Graph';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><polyline points="6 17 9 13 13 17 18 10"/></svg>`;
            btn.onclick = () => {
              this.graphOutput.emit({
                time: params.data.shimmer1_timestamps,
                abs: params.data.shimmer1_accel_ln_abs
              });
            };
            return btn;
          },
          minWidth: 40, maxWidth: 60
        },
      ]
    },
    {
      headerName: 'Shimmer 2',
      groupId: 'shimmer2',
      children: [
        { headerName: 'Day', field: 'shimmer2_shimmer_day', filter: 'agTextColumnFilter', sortable: true, minWidth: 80, maxWidth: 100 },
        { headerName: 'Accel Var', field: 'shimmer2_accel_var', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        // { headerName: 'Time', field: 'shimmer2_time', filter: 'agTextColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Full File Name', field: 'shimmer2_full_file_name', filter: 'agTextColumnFilter', sortable: true, minWidth: 220, maxWidth: 320, hide: true },
        { headerName: 'MAC Address', field: 'shimmer2_mac_address', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 180 },
                {
          headerName: '',
          field: 'shimmer2_graph',
          cellRenderer: (params: any) => {
            const hasTime = Array.isArray(params.data.shimmer2_timestamps) && params.data.shimmer2_timestamps.length > 0;
            const hasAbs = Array.isArray(params.data.shimmer2_accel_ln_abs) && params.data.shimmer2_accel_ln_abs.length > 0;
            if (!hasTime || !hasAbs) return '';
            const btn = document.createElement('button');
            btn.className = 'ag-btn ag-btn-graph themed-graph-btn';
            btn.title = 'Show Graph';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><polyline points="6 17 9 13 13 17 18 10"/></svg>`;
            btn.onclick = () => {
              this.graphOutput.emit({
                time: params.data.shimmer2_timestamps,
                abs: params.data.shimmer2_accel_ln_abs
              });
            };
            return btn;
          },
          minWidth: 40, maxWidth: 60
        },
    ],
    }
  ];


  quickFilterText: string = '';
  isLoading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.listFilesCombinedMeta().subscribe((resp: any) => {
      if (resp && Array.isArray(resp.data)) {
        this.rowData = resp.data.flatMap((item: any) => {
          const shimmer1Rows = (item.shimmer1_decoded || []).map((s: any) => ({
            patient: item.patient,
            device: item.device,
            date: item.date,
            shimmer1: item.shimmer1,
            shimmer1_time: s.time,
            shimmer1_full_file_name: s.full_file_name,
            shimmer1_mac_address: s.mac_address,
            shimmer1_experiment_name: s.experiment_name,
            shimmer1_shimmer_device: s.shimmer_device,
            shimmer1_filename: s.filename,
            shimmer1_shimmer_day: s.shimmer_day,
            shimmer1_part: s.part,
            shimmer1_timestamps: s.timestamps,
            shimmer1_accel_ln_abs: s.accel_ln_abs,
            shimmer1_accel_var: s.accel_var
          }));
          const shimmer2Rows = (item.shimmer2_decoded || []).map((s: any) => ({
            patient: item.patient,
            device: item.device,
            date: item.date,
            shimmer2: item.shimmer2,
            shimmer2_time: s.time,
            shimmer2_full_file_name: s.full_file_name,
            shimmer2_mac_address: s.mac_address,
            shimmer2_experiment_name: s.experiment_name,
            shimmer2_shimmer_device: s.shimmer_device,
            shimmer2_filename: s.filename,
            shimmer2_shimmer_day: s.shimmer_day,
            shimmer2_part: s.part,
            shimmer2_timestamps: s.timestamps,
            shimmer2_accel_ln_abs: s.accel_ln_abs,
            shimmer2_accel_var: s.accel_var
          }));
          return [...shimmer1Rows, ...shimmer2Rows];
        });
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  gridOptions: any;
}
