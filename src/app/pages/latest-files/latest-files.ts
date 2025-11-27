import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-latest-files',
  standalone: false,
  templateUrl: './latest-files.html',
  styleUrls: ['./latest-files.css']
})
export class LatestFilesPage implements OnInit {
  public latestFiles: Array<{ shimmer: string, file: any, date: string, time: string }> = [];
  public loading = true;
  public error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.listFilesDeconstructed().subscribe({
      next: (files: any) => {
        let fileList: any[] = [];
        if (Array.isArray(files)) {
          fileList = files;
        } else if (files && Array.isArray(files.data)) {
          fileList = files.data;
        } else {
          this.error = 'Unexpected files response';
          this.loading = false;
          return;
        }
        // Map shimmer_device to latest file
        const latestMap = new Map<string, any>();
        fileList.forEach(file => {
          if (file.shimmer_device && file.date && file.time) {
            const key = file.shimmer_device;
            const fileDateTime = new Date(`${file.date}T${file.time}`);
            if (!latestMap.has(key) || fileDateTime > new Date(`${latestMap.get(key).date}T${latestMap.get(key).time}`)) {
              latestMap.set(key, file);
            }
          }
        });
        this.latestFiles = Array.from(latestMap.entries()).map(([shimmer, file]) => ({
          shimmer,
          file,
          date: file.date,
          time: file.time
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load files';
        this.loading = false;
      }
    });
  }
}
