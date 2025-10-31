// ...existing imports...
import Chart from 'chart.js/auto';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { forkJoin } from 'rxjs';

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
    {
      headerName: '',
      field: 'common_action',
      minWidth: 50,
      maxWidth: 70,
      cellRenderer: (params: any) => {
        // Show button only if both shimmer1 and shimmer2 are present
        const hasShimmer1 = params.data && params.data.shimmer1_full_file_name;
        const hasShimmer2 = params.data && params.data.shimmer2_full_file_name;
        if (hasShimmer1 && hasShimmer2) {
          const btn = document.createElement('button');
          btn.className = 'ag-btn ag-btn-action themed-action-btn';
          btn.title = 'Show Details';
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;
          btn.onclick = () => {
            // Placeholder: implement desired action here
            alert('Magnifying glass action for both shimmers!');
          };
          return btn;
        }
        return '';
      }
    },
  { headerName: 'Patient', field: 'patient', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
  { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
  { headerName: 'Synced Date', field: 'date', filter: 'agDateColumnFilter', sortable: true, minWidth: 120, maxWidth: 140 },
    {
      headerName: 'Shimmer 1',
      groupId: 'shimmer1',
      children: [
        { headerName: 'Recorded Time', field: 'shimmer1_recorded_timestamp', filter: 'agTextColumnFilter', sortable: true, minWidth: 180, maxWidth: 220 },
        { headerName: 'Day', field: 'shimmer1_shimmer_day', filter: 'agTextColumnFilter', sortable: true, minWidth: 80, maxWidth: 100 },
        { headerName: 'Accel Var', field: 'shimmer1_accel_var', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        // { headerName: 'Time', field: 'shimmer1_time', filter: 'agTextColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Full File Name', field: 'shimmer1_full_file_name', filter: 'agTextColumnFilter', sortable: true, minWidth: 220, maxWidth: 320, hide: true },
        { headerName: 'MAC Address', field: 'shimmer1_mac_address', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 180 },
        {
          headerName: '',
          field: 'shimmer1_graph',
          cellRenderer: (params: any) => {
            const fullFileName = params.data.shimmer1_full_file_name;
            if (!fullFileName) return '';
            const btn = document.createElement('button');
            btn.className = 'ag-btn ag-btn-graph themed-graph-btn';
            btn.title = 'Show Graph';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><polyline points="6 17 9 13 13 17 18 10"/></svg>`;
            btn.onclick = () => {
              btn.disabled = true;
              btn.style.opacity = '0.5';
              forkJoin({
                time: this.apiService.getDecodedFieldDirect(fullFileName, 'timestampCal'),
                abs: this.apiService.getDecodedFieldDirect(fullFileName, 'Accel_WR_Absolute')
              }).subscribe({
                next: (result) => {
                  console.log('API Response for Shimmer 1:', result);
                  console.log('Time data:', result.time);
                  console.log('Abs data:', result.abs);
                  
                  // Send raw data - downsampling will be handled in the modal
                  this.graphOutput.emit({
                    time: result.time?.values || [],
                    abs: result.abs?.values || []
                  });
                  btn.disabled = false;
                  btn.style.opacity = '1';
                },
                error: (err) => {
                  console.error('Error fetching graph data:', err);
                  btn.disabled = false;
                  btn.style.opacity = '1';
                  alert('Failed to load graph data');
                }
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
        { headerName: 'Recorded Time', field: 'shimmer2_recorded_timestamp', filter: 'agTextColumnFilter', sortable: true, minWidth: 180, maxWidth: 220 },
        { headerName: 'Day', field: 'shimmer2_shimmer_day', filter: 'agTextColumnFilter', sortable: true, minWidth: 80, maxWidth: 100 },
        { headerName: 'Accel Var', field: 'shimmer2_accel_var', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        // { headerName: 'Time', field: 'shimmer2_time', filter: 'agTextColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Full File Name', field: 'shimmer2_full_file_name', filter: 'agTextColumnFilter', sortable: true, minWidth: 220, maxWidth: 320, hide: true },
        { headerName: 'MAC Address', field: 'shimmer2_mac_address', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 180 },
        {
          headerName: '',
          field: 'shimmer2_graph',
          cellRenderer: (params: any) => {
            const fullFileName = params.data.shimmer2_full_file_name;
            if (!fullFileName) return '';
            const btn = document.createElement('button');
            btn.className = 'ag-btn ag-btn-graph themed-graph-btn';
            btn.title = 'Show Graph';
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><polyline points="6 17 9 13 13 17 18 10"/></svg>`;
            btn.onclick = () => {
              btn.disabled = true;
              btn.style.opacity = '0.5';
              forkJoin({
                time: this.apiService.getDecodedFieldDirect(fullFileName, 'timestampCal'),
                abs: this.apiService.getDecodedFieldDirect(fullFileName, 'Accel_WR_Absolute')
              }).subscribe({
                next: (result) => {
                  console.log('API Response for Shimmer 2:', result);
                  console.log('Time data:', result.time);
                  console.log('Abs data:', result.abs);
                  
                  // Send raw data - downsampling will be handled in the modal
                  this.graphOutput.emit({
                    time: result.time?.values || [],
                    abs: result.abs?.values || []
                  });
                  btn.disabled = false;
                  btn.style.opacity = '1';
                },
                error: (err) => {
                  console.error('Error fetching graph data:', err);
                  btn.disabled = false;
                  btn.style.opacity = '1';
                  alert('Failed to load graph data');
                }
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
          const shimmer1Arr = item.shimmer1_decoded || [];
          const shimmer2Arr = item.shimmer2_decoded || [];
          const maxLen = Math.max(shimmer1Arr.length, shimmer2Arr.length);
          const rows = [];
          for (let i = 0; i < maxLen; i++) {
            const s1 = shimmer1Arr[i] || {};
            const s2 = shimmer2Arr[i] || {};
            rows.push({
              patient: item.patient,
              device: item.device,
              date: item.date,
              shimmer1: item.shimmer1,
              shimmer2: item.shimmer2,
              // Shimmer 1 fields
              shimmer1_recorded_timestamp: s1.recordedTimestamp ? new Date(s1.recordedTimestamp).toLocaleString() : null,
              shimmer1_time: s1.time,
              shimmer1_full_file_name: s1.full_file_name,
              shimmer1_mac_address: s1.macAddress,
              shimmer1_experiment_name: s1.experiment_name,
              shimmer1_shimmer_device: s1.shimmer_device,
              shimmer1_filename: s1.filename,
              shimmer1_shimmer_day: s1.shimmer_day,
              shimmer1_part: s1.part,
              shimmer1_accel_var: s1.Accel_WR_VAR ? parseFloat(Number(s1.Accel_WR_VAR).toFixed(4)) : null,
              // Shimmer 2 fields
              shimmer2_recorded_timestamp: s2.recordedTimestamp ? new Date(s2.recordedTimestamp).toLocaleString() : null,
              shimmer2_time: s2.time,
              shimmer2_full_file_name: s2.full_file_name,
              shimmer2_mac_address: s2.macAddress,
              shimmer2_experiment_name: s2.experiment_name,
              shimmer2_shimmer_device: s2.shimmer_device,
              shimmer2_filename: s2.filename,
              shimmer2_shimmer_day: s2.shimmer_day,
              shimmer2_part: s2.part,
              shimmer2_accel_var: s2.Accel_WR_VAR ? parseFloat(Number(s2.Accel_WR_VAR).toFixed(4)) : null
            });
          }
          return rows;
        });
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }

  gridOptions: any;
}

