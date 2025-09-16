// Dashboard Presentation Component
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dashboard-presentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-presentation.component.html',
  styleUrls: ['./dashboard-presentation.component.css']
})
export class DashboardPresentationComponent {
  @Input() dashboardData: any;
  @Input() recentFiles: any[] = [];
  @Input() recentReports: any[] = [];
  @Output() uploadFile = new EventEmitter<File>();

  showUploadModal = false;
  selectedFile: File | null = null;

  openUploadModal() {
    this.showUploadModal = true;
  }
  closeUploadModal() {
    this.showUploadModal = false;
    this.selectedFile = null;
  }
  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  uploadSelectedFile() {
    if (this.selectedFile) {
      this.uploadFile.emit(this.selectedFile);
      this.closeUploadModal();
    }
  }

  startUpload() {
    this.uploadSelectedFile();
  }
}
