import { Component, inject } from '@angular/core';
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
      [dataSyncSuccess]="dataSyncSuccess"
      [dataSources]="facade.dataSources()"
      (addSource)="onAddSource()"
    ></app-data-sources-overview-presentation>
  `
})
export class DataSourcesOverviewContainerComponent {
  facade = inject(DataSourcesFacade);
  router = inject(Router);
  dataSyncSuccess = 92; // TODO: Calculate based on real data if needed

  constructor() {
    this.facade.loadDataSources();
  }

  onAddSource() {
    this.router.navigate(['/data-sources/add']);
  }
}
