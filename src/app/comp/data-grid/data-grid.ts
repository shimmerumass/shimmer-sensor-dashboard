import { Component, OnInit } from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-data-grid',
  standalone: false,
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.css'
})
export class DataGrid implements OnInit {
  rowData: any[] = [];
  columnDefs: (ColDef | ColGroupDef)[] = [
    { headerName: 'Patient', field: 'patient', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
    { headerName: 'Device', field: 'device', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
    { headerName: 'Date', field: 'date', filter: 'agDateColumnFilter', sortable: true, minWidth: 120, maxWidth: 140 },
    {
      headerName: 'Shimmer 1',
      groupId: 'shimmer1',
      children: [
        { headerName: 'Name', field: 'shimmer1', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
        { headerName: 'Time', field: 'shimmer1_time', filter: 'agTextColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Full File Name', field: 'shimmer1_full_file_name', filter: 'agTextColumnFilter', sortable: true, minWidth: 220, maxWidth: 320, hide: true },
        { headerName: 'MAC Address', field: 'shimmer1_mac_address', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 180 },
        { headerName: 'Sample Rate', field: 'shimmer1_sample_rate', filter: 'agNumberColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Sensors0', field: 'shimmer1_sensors0', filter: 'agNumberColumnFilter', sortable: true, minWidth: 90, maxWidth: 110 },
        { headerName: 'Sensors1', field: 'shimmer1_sensors1', filter: 'agNumberColumnFilter', sortable: true, minWidth: 90, maxWidth: 110 },
        { headerName: 'Sensors2', field: 'shimmer1_sensors2', filter: 'agNumberColumnFilter', sortable: true, minWidth: 90, maxWidth: 110 },
        { headerName: 'Config Byte 3', field: 'shimmer1_configByte3', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Trial Config 0', field: 'shimmer1_trialConfig0', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Trial Config 1', field: 'shimmer1_trialConfig1', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Shimmer Version', field: 'shimmer1_shimmer_version', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Experiment ID', field: 'shimmer1_experiment_id', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'N Shimmer', field: 'shimmer1_n_shimmer', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Type', field: 'shimmer1_fw_type', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Major', field: 'shimmer1_fw_major', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Minor', field: 'shimmer1_fw_minor', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Internal', field: 'shimmer1_fw_internal', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 }
      ]
    },
    {
      headerName: 'Shimmer 2',
      groupId: 'shimmer2',
      children: [
        { headerName: 'Name', field: 'shimmer2', filter: 'agTextColumnFilter', sortable: true, minWidth: 120, maxWidth: 160 },
        { headerName: 'Time', field: 'shimmer2_time', filter: 'agTextColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Full File Name', field: 'shimmer2_full_file_name', filter: 'agTextColumnFilter', sortable: true, minWidth: 220, maxWidth: 320, hide: true },
        { headerName: 'MAC Address', field: 'shimmer2_mac_address', filter: 'agTextColumnFilter', sortable: true, minWidth: 140, maxWidth: 180 },
        { headerName: 'Sample Rate', field: 'shimmer2_sample_rate', filter: 'agNumberColumnFilter', sortable: true, minWidth: 100, maxWidth: 120 },
        { headerName: 'Sensors0', field: 'shimmer2_sensors0', filter: 'agNumberColumnFilter', sortable: true, minWidth: 90, maxWidth: 110 },
        { headerName: 'Sensors1', field: 'shimmer2_sensors1', filter: 'agNumberColumnFilter', sortable: true, minWidth: 90, maxWidth: 110 },
        { headerName: 'Sensors2', field: 'shimmer2_sensors2', filter: 'agNumberColumnFilter', sortable: true, minWidth: 90, maxWidth: 110 },
        { headerName: 'Config Byte 3', field: 'shimmer2_configByte3', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Trial Config 0', field: 'shimmer2_trialConfig0', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Trial Config 1', field: 'shimmer2_trialConfig1', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Shimmer Version', field: 'shimmer2_shimmer_version', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'Experiment ID', field: 'shimmer2_experiment_id', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'N Shimmer', field: 'shimmer2_n_shimmer', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Type', field: 'shimmer2_fw_type', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Major', field: 'shimmer2_fw_major', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Minor', field: 'shimmer2_fw_minor', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 },
        { headerName: 'FW Internal', field: 'shimmer2_fw_internal', filter: 'agNumberColumnFilter', sortable: true, minWidth: 110, maxWidth: 130 }
      ]
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
            shimmer1_sample_rate: s.sample_rate,
            shimmer1_sensors0: s.sensors0,
            shimmer1_sensors1: s.sensors1,
            shimmer1_sensors2: s.sensors2,
            shimmer1_configByte3: s.configByte3,
            shimmer1_trialConfig0: s.trialConfig0,
            shimmer1_trialConfig1: s.trialConfig1,
            shimmer1_shimmer_version: s.shimmer_version,
            shimmer1_experiment_id: s.experiment_id,
            shimmer1_n_shimmer: s.n_shimmer,
            shimmer1_fw_type: s.fw_type,
            shimmer1_fw_major: s.fw_major,
            shimmer1_fw_minor: s.fw_minor,
            shimmer1_fw_internal: s.fw_internal
          }));
          const shimmer2Rows = (item.shimmer2_decoded || []).map((s: any) => ({
            patient: item.patient,
            device: item.device,
            date: item.date,
            shimmer2: item.shimmer2,
            shimmer2_time: s.time,
            shimmer2_full_file_name: s.full_file_name,
            shimmer2_mac_address: s.mac_address,
            shimmer2_sample_rate: s.sample_rate,
            shimmer2_sensors0: s.sensors0,
            shimmer2_sensors1: s.sensors1,
            shimmer2_sensors2: s.sensors2,
            shimmer2_configByte3: s.configByte3,
            shimmer2_trialConfig0: s.trialConfig0,
            shimmer2_trialConfig1: s.trialConfig1,
            shimmer2_shimmer_version: s.shimmer_version,
            shimmer2_experiment_id: s.experiment_id,
            shimmer2_n_shimmer: s.n_shimmer,
            shimmer2_fw_type: s.fw_type,
            shimmer2_fw_major: s.fw_major,
            shimmer2_fw_minor: s.fw_minor,
            shimmer2_fw_internal: s.fw_internal
          }));
          return [...shimmer1Rows, ...shimmer2Rows];
        });
      }
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }
}
