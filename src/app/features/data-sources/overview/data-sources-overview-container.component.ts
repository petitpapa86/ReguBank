// src/app/features/data-sources/overview/data-sources-overview-container.component.ts - UPDATED
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourcesOverviewPresentationComponent } from './data-sources-overview-presentation.component';
import { DataSourcesFacade } from '../../../core/facades/data-sources.facade';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-sources-overview-container',
  standalone: true,
  imports: [CommonModule, DataSourcesOverviewPresentationComponent],
  template: `
    <app-data-sources-overview-presentation
      [connectedSources]="facade.connectedSources()"
      [sourcesWithIssues]="facade.sourcesWithIssues()"
      [totalSources]="facade.totalSources()"
      [dataSyncSuccess]="dataSyncSuccess()"
      [dataSources]="facade.dataSources()"
      [isLoading]="facade.isLoading()"
      [error]="facade.lastError()"
      (addSource)="onAddSource()"
      (deleteSource)="onDeleteSource($event)"
      (refreshSource)="onRefreshSource($event)"
      (refreshSources)="onRefreshSources()"
      (errorDismiss)="onErrorDismiss()"
    ></app-data-sources-overview-presentation>
  `
})
export class DataSourcesOverviewContainerComponent {
  facade = inject(DataSourcesFacade);
  router = inject(Router);
  
  // Calculate based on connected vs total sources
  dataSyncSuccess = computed(() => {
    const total = this.facade.totalSources();
    const connected = this.facade.connectedSources();
    return total > 0 ? Math.round((connected / total) * 100) : 0;
  });

  onAddSource() {
    this.router.navigate(['/data-sources/add']);
  }

  async onDeleteSource(id: string) {
    if (confirm('Are you sure you want to delete this data source?')) {
      await this.facade.deleteDataSource(id);
    }
  }

  onRefreshSource(id: string) {
    // Individual source refresh logic here
    console.log('Refreshing source:', id);
    // Could trigger individual source sync
  }

  onRefreshSources() {
    this.facade.loadDataSources();
  }

  onErrorDismiss() {
    this.facade.clearError();
  }
}