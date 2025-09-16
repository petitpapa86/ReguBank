// Dashboard Container Component
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { DashboardFacade } from '../../../core/facades/dashboard.facade';
import { DashboardPresentationComponent } from '../presentation/dashboard-presentation.component';

@Component({
  selector: 'dashboard-container',
  standalone: true,
  imports: [CommonModule, DashboardPresentationComponent],
  template: `
    <dashboard-presentation
      [dashboardData]="dashboardData()"
      [recentFiles]="recentFiles()"
      [recentReports]="recentReports()"
      (uploadFile)="onUploadFile($event)"
    ></dashboard-presentation>
  `
})
export class DashboardContainerComponent {
  facade = inject(DashboardFacade);

  get dashboardData() {
    return this.facade.stats;
  }
  get recentFiles() {
    return this.facade.recentFiles;
  }
  get recentReports() {
    return this.facade.recentReports;
  }

  onUploadFile(file: File) {
    // handle file upload logic here
    // e.g., POST to json-server or show notification
  }
}
