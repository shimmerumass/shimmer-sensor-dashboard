import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';
import { ApiService } from '../../services/api.service';
import { GridApi, GridReadyEvent, ColDef } from 'ag-grid-community';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';

export interface CombinedDataRow {
  date: string;
  patient: string;
  device: string;
  shimmer1: string;
  shimmer2: string;
  shimmer1File: string;
  shimmer2File: string;
  shimmer1AccelPoints?: number;
  shimmer2AccelPoints?: number;
  shimmer1UwbNonZero?: number;
  shimmer2UwbNonZero?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardPage implements OnInit {
  private gridApi?: GridApi;
  rowData: CombinedDataRow[] = [];
  isLoading = false;
  loadError = '';
  quickFilterText = '';

  // Modal properties
  selectedRow: CombinedDataRow | null = null;

  // Chart properties
  showChartModal = false;
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Accel_WR_Absolute',
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0
    }]
  };
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      x: {
        title: { display: true, text: 'Sample Index' }
      },
      y: {
        title: { display: true, text: 'Acceleration (m/s²)' }
      }
    }
  };
  chartStats = {
    mean: 0,
    max: 0,
    min: 0,
    uwbNonZero: 0,
    accelPoints: 0
  };
  currentChartShimmer: 'shimmer1' | 'shimmer2' = 'shimmer1';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  columnDefs: ColDef[] = [
    { field: 'date', headerName: 'Date', sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 100 },
    { field: 'patient', headerName: 'Patient', sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 120 },
    { field: 'device', headerName: 'Device', sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 150 },
    { field: 'shimmer1', headerName: 'Shimmer1', sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 120 },
    { field: 'shimmer2', headerName: 'Shimmer2', sortable: true, filter: 'agTextColumnFilter', flex: 1, minWidth: 120 },
    { 
      field: 'shimmer1File', 
      headerName: 'Shimmer1 File', 
      sortable: true, 
      filter: 'agTextColumnFilter',
      hide: true,
      width: 250,
      cellRenderer: (params: any) => {
        if (!params.value || params.value === '-') return '-';
        const fileName = params.value.length > 30 ? params.value.substring(0, 30) + '...' : params.value;
        return `<span title="${params.value}">${fileName}</span>`;
      }
    },
    { 
      field: 'shimmer2File', 
      headerName: 'Shimmer2 File', 
      sortable: true, 
      filter: 'agTextColumnFilter',
      width: 250,
      hide: true,
      cellRenderer: (params: any) => {
        if (!params.value || params.value === '-') return '-';
        const fileName = params.value.length > 30 ? params.value.substring(0, 30) + '...' : params.value;
        return `<span title="${params.value}">${fileName}</span>`;
      }
    },
    {
      headerName: 'Actions',
      flex: 0,
      width: 100,
      cellRenderer: (params: any) => {
        return `
          <div style="display: flex; gap: 0.25rem; align-items: center; justify-content: center;">
            <button 
              class="action-btn view-btn" 
              data-action="view"
              style="
                background-color: hsl(190, 95%, 30%);
                color: white;
                border: 1px solid hsl(190, 95%, 20%);
                border-radius: 0.375rem;
                padding: 0.25rem 0.5rem;
                font-size: 0.75rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                display: inline-block;
                text-align: center;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                white-space: nowrap;
                line-height: 1.2;
              "
              onmouseover="this.style.backgroundColor='hsl(190, 95%, 25%)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.15)'; this.style.transform='translateY(-1px)'"
              onmouseout="this.style.backgroundColor='hsl(190, 95%, 30%)'; this.style.boxShadow='0 1px 2px rgba(0, 0, 0, 0.1)'; this.style.transform='translateY(0)'"
              onmousedown="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 2px rgba(0, 0, 0, 0.1)'"
              onmouseup="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.15)'"
            >
              View
            </button>
          </div>
        `;
      }
    }
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true
  };

  constructor(private router: Router, private apiService: ApiService) {}

  async ngOnInit() {
    await this.checkAuth();
    this.loadData();
  }

  async checkAuth() {
    try {
      const session = await fetchAuthSession();
      const isAuth = session?.tokens?.idToken ? true : false;
      if (!isAuth) this.router.navigate(['/login']);
    } catch {
      this.router.navigate(['/login']);
    }
  }

  loadData() {
    this.isLoading = true;
    this.loadError = '';
    
    // Try the new combined-data-files endpoint first, fallback to combined-meta
    this.apiService.getCombinedDataFiles().subscribe({
      next: (resp: any) => {
        this.processData(resp);
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('getCombinedDataFiles failed, trying listFilesCombinedMeta', err);
        // Fallback to existing endpoint
        this.apiService.listFilesCombinedMeta().subscribe({
          next: (resp: any) => {
            this.processData(resp);
            this.isLoading = false;
          },
          error: (err2) => {
            console.error('Failed to load combined data', err2);
            this.loadError = 'Failed to load data. Please try again.';
            this.isLoading = false;
          }
        });
      }
    });
  }

  processData(resp: any) {
    console.log('Raw API response:', resp);
    const data = resp?.data || resp || [];
    console.log('Extracted data array:', data);
    const processed: CombinedDataRow[] = [];

    // Handle the actual API response format:
    // { date, patient, shimmer1, shimmer2, shimmer1_file, shimmer2_file }
    data.forEach((item: any) => {
      // Extract device from filename (e.g., "a9ae0f999916e210_2025-12-11_Shimmer_DCFF_combined.json" -> "a9ae0f999916e210")
      let device = 'Unknown';
      if (item.shimmer1_file) {
        const parts = item.shimmer1_file.split('_');
        if (parts.length > 0) {
          device = parts[0];
        }
      } else if (item.shimmer2_file) {
        const parts = item.shimmer2_file.split('_');
        if (parts.length > 0) {
          device = parts[0];
        }
      }

      // Log the item to see what fields are available
      console.log('Processing item:', item);
      console.log('Item keys:', Object.keys(item));
      
      processed.push({
        date: item.date || '',
        patient: item.patient || 'Unknown',
        device: device,
        shimmer1: item.shimmer1 || '-',
        shimmer2: item.shimmer2 || '-',
        shimmer1File: item.shimmer1_file || item.shimmer1File || '-',
        shimmer2File: item.shimmer2_file || item.shimmer2File || '-',
        shimmer1AccelPoints: item.shimmer1_accel_points || item.shimmer1AccelPoints || 0,
        shimmer2AccelPoints: item.shimmer2_accel_points || item.shimmer2AccelPoints || 0,
        shimmer1UwbNonZero: item.shimmer1_uwb_dis_non_zero_count || item.shimmer1_uwb_dis_non_zero_count || item.shimmer1_uwb_non_zero || item.shimmer1UwbNonZero || 0,
        shimmer2UwbNonZero: item.shimmer2_uwb_dis_non_zero_count || item.shimmer2_uwb_dis_non_zero_count || item.shimmer2_uwb_non_zero || item.shimmer2UwbNonZero || 0
      });
      
      console.log('Processed row UWB counts:', {
        shimmer1: processed[processed.length - 1].shimmer1UwbNonZero,
        shimmer2: processed[processed.length - 1].shimmer2UwbNonZero
      });
    });

    console.log('Processed data:', processed);
    console.log('Sample row:', processed[0]);
    this.rowData = [...processed]; // Create new array reference to trigger change detection
    console.log('rowData set, length:', this.rowData.length);
    
    // If grid is already ready, explicitly update it
    if (this.gridApi) {
      this.gridApi.setGridOption('rowData', this.rowData);
      console.log('Updated grid with rowData:', this.rowData.length, 'rows');
    }
  }

  onGridReady(event: GridReadyEvent<any>) {
    this.gridApi = event.api;
    console.log('Grid ready! rowData length:', this.rowData.length);
    console.log('Grid API:', this.gridApi);
    console.log('Column defs:', this.columnDefs);
    
    // Explicitly set rowData if it's already loaded (handles case where grid initializes before data)
    if (this.rowData && this.rowData.length > 0) {
      this.gridApi.setGridOption('rowData', this.rowData);
      console.log('Explicitly set rowData in grid:', this.rowData.length, 'rows');
      console.log('First row sample:', this.rowData[0]);
    }
    
    // Auto-size columns to fit content
    setTimeout(() => {
      const allColumnIds: string[] = [];
      event.api.getColumns()?.forEach((column: any) => {
        if (column && column.getColId) {
          allColumnIds.push(column.getColId());
        }
      });
      if (allColumnIds.length > 0) {
        event.api.autoSizeColumns(allColumnIds, false);
      }
    }, 100);
    
    // Handle action button clicks using cellClicked event
    event.api.addEventListener('cellClicked', (e: any) => {
      const target = e.event?.target as HTMLElement;
      // Check if clicked element is a button with action-btn or view-btn class, or if it's inside such a button
      const button = target.closest('.action-btn, .view-btn') as HTMLElement;
      if (button) {
        const action = button.getAttribute('data-action');
        const rowData = e.data as CombinedDataRow;
        
        console.log('Button clicked:', action, 'Row data:', rowData);
        
        if (rowData) {
          if (action === 'view') {
            this.showChart(rowData);
          }
        }
      }
    });
  }

  exportCSV() {
    if (!this.gridApi) return;
    this.gridApi.exportDataAsCsv({
      fileName: `shimmer-data-${new Date().toISOString().split('T')[0]}.csv`
    });
  }

  showChart(row: CombinedDataRow) {
    this.selectedRow = row;
    // Default to shimmer1 if available, otherwise shimmer2
    this.currentChartShimmer = row.shimmer1 !== '-' ? 'shimmer1' : 'shimmer2';
    const filename = this.currentChartShimmer === 'shimmer1' 
      ? (row.shimmer1File !== '-' ? row.shimmer1File : null)
      : (row.shimmer2File !== '-' ? row.shimmer2File : null);
    
    if (filename && filename !== '-') {
      this.loadChartData(filename, 'accel_wr_absolute_downsampled');
    } else {
      // Show modal even if no data, with empty stats
      this.showChartModal = true;
    }
  }

  loadChartData(filename: string, fieldName: string) {
    this.isLoading = true;
    
    // Get UWB count from the row data first (already loaded)
    const uwbCountFromRow = this.currentChartShimmer === 'shimmer1' 
      ? (this.selectedRow?.shimmer1UwbNonZero || 0)
      : (this.selectedRow?.shimmer2UwbNonZero || 0);
    
    // Load both acceleration data and file data in parallel
    forkJoin({
      accelData: this.apiService.getCombinedDataField(filename, fieldName),
      fileData: this.apiService.getCombinedDataFile(filename)
    }).subscribe({
      next: (results: any) => {
        const values = results.accelData?.values || results.accelData || [];
        const labels = Array.from({ length: values.length }, (_, i) => i.toString());
        
        this.chartData = {
          labels: labels,
          datasets: [{
            data: values,
            label: 'Accel_WR_Absolute',
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0
          }]
        };

        // Try to get UWB count from file data as fallback, but prefer row data
        console.log('Full file data:', results.fileData);
        console.log('File data keys:', Object.keys(results.fileData || {}));
        
        // Recursive function to find uwb_dis_non_zero_count anywhere in the object
        const findUwbCount = (obj: any): number => {
          if (!obj || typeof obj !== 'object') return 0;
          if (obj.uwb_dis_non_zero_count !== undefined && obj.uwb_dis_non_zero_count !== null) {
            return Number(obj.uwb_dis_non_zero_count);
          }
          for (const key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
              const result = findUwbCount(obj[key]);
              if (result > 0) return result;
            }
          }
          return 0;
        };
        
        const uwbCountFromFile = findUwbCount(results.fileData);
        const uwbCount = uwbCountFromRow > 0 ? uwbCountFromRow : uwbCountFromFile;
        const accelPoints = values.length || 0;
        
        console.log('UWB count from row:', uwbCountFromRow);
        console.log('UWB count from file:', uwbCountFromFile);
        console.log('UWB count final:', uwbCount);
        
        // Calculate statistics
        if (values.length > 0) {
          const numericValues = values.map((v: any) => parseFloat(v)).filter((v: any) => !isNaN(v));
          this.chartStats = {
            mean: numericValues.reduce((a: number, b: number) => a + b, 0) / numericValues.length,
            max: Math.max(...numericValues),
            min: Math.min(...numericValues),
            uwbNonZero: uwbCount,
            accelPoints: accelPoints
          };
        } else {
          this.chartStats = {
            mean: 0,
            max: 0,
            min: 0,
            uwbNonZero: uwbCount,
            accelPoints: accelPoints
          };
        }

        this.showChartModal = true;
        this.isLoading = false;
        
        setTimeout(() => {
          this.chart?.update();
        }, 100);
      },
      error: (err: any) => {
        console.error('Failed to load chart data', err);
        alert('Failed to load chart data. Please try again.');
        this.isLoading = false;
      }
    });
  }

  closeChartModal() {
    this.showChartModal = false;
  }

  downloadFile() {
    if (!this.selectedRow) return;
    
    const filename = this.currentChartShimmer === 'shimmer1' 
      ? (this.selectedRow.shimmer1File !== '-' ? this.selectedRow.shimmer1File : null)
      : (this.selectedRow.shimmer2File !== '-' ? this.selectedRow.shimmer2File : null);
    
    if (!filename || filename === '-') {
      alert('No file available for download');
      return;
    }

    // Get the file data and trigger download
    this.apiService.getCombinedDataFile(filename).subscribe({
      next: (fileData: any) => {
        // Create a blob and download
        const jsonStr = JSON.stringify(fileData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download file', err);
        alert('Failed to download file. Please try again.');
      }
    });
  }

  toggleShimmer(shimmer: 'shimmer1' | 'shimmer2') {
    if (!this.selectedRow) return;
    this.currentChartShimmer = shimmer;
    const filename = shimmer === 'shimmer1' 
      ? (this.selectedRow.shimmer1File !== '-' ? this.selectedRow.shimmer1File : null)
      : (this.selectedRow.shimmer2File !== '-' ? this.selectedRow.shimmer2File : null);
    
    if (filename) {
      this.loadChartData(filename, 'accel_wr_absolute_downsampled');
    }
  }

  exportChart() {
    if (!this.chart) return;
    const canvas = this.chart.chart?.canvas;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `shimmer-chart-${this.selectedRow?.date}-${this.currentChartShimmer}.png`;
      link.click();
    }
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}

