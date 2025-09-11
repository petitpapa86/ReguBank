import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSourcesOverviewPresentationComponent } from './data-sources-overview-presentation.component';

@Component({
  selector: 'app-data-sources-overview-container',
  standalone: true,
  imports: [CommonModule, DataSourcesOverviewPresentationComponent],
  template: `
    <app-data-sources-overview-presentation
      [connectedSources]="connectedSources"
      [sourcesWithIssues]="sourcesWithIssues"
      [totalSources]="totalSources"
      [dataSyncSuccess]="dataSyncSuccess"
      [dataSources]="dataSources"
      (addSource)="onAddSource()"
    ></app-data-sources-overview-presentation>
  `
})
export class DataSourcesOverviewContainerComponent {
  connectedSources = 12;
  sourcesWithIssues = 2;
  totalSources = 15;
  dataSyncSuccess = 92;
  dataSources = [
    { system: 'Core Banking', status: 'Connected', host: 'core.bankingsystem.com', lastSync: '2024-01-20 14:30' },
    { system: 'CRM', status: 'Connected', host: 'crm.customerrelations.com', lastSync: '2024-01-20 14:25' },
    { system: 'Risk Management', status: 'Issues', host: 'risk.managementsystem.com', lastSync: '2024-01-20 14:15' },
    { system: 'General Ledger', status: 'Connected', host: 'gl.ledger.com', lastSync: '2024-01-20 14:00' },
    { system: 'SWIFT', status: 'Disconnected', host: 'swift.network.com', lastSync: '2024-01-20 13:45' },
    { system: 'Regulatory Systems', status: 'Connected', host: 'reg.compliance.com', lastSync: '2024-01-20 13:30' }
  ];

  onAddSource() {
    // Navigate to add-source route
    window.location.href = '/data-sources/add';
  }
}
