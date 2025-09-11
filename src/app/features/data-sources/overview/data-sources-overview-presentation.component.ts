// src/app/features/data-sources/overview/data-sources-overview-presentation.component.ts - FIXED
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorBannerComponent } from '../../../shared/components/error-banner.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-data-sources-overview-presentation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ErrorBannerComponent],
  template: `
    <!-- CONSISTENT LAYOUT PATTERN -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <span class="font-semibold text-gray-700">Data Sources</span>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div class="mb-4 sm:mb-0">
          <h1 class="text-3xl font-bold text-gray-900">Data Sources Overview</h1>
          <p class="text-gray-600 mt-2">Manage and monitor all your banking system integrations.</p>
        </div>
        <button class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition-colors" 
                (click)="addSource.emit()">
          + Add Data Source
        </button>
      </div>

      <!-- Error Handling -->
      <app-error-banner 
        [error]="error" 
        [dismissible]="true"
        (dismiss)="errorDismiss.emit()">
      </app-error-banner>

      <!-- Loading State -->
      <app-loading-spinner 
        [isLoading]="isLoading" 
        message="Loading data sources...">
      </app-loading-spinner>

      <!-- Content -->
      @if (!isLoading) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-green-600">{{connectedSources}}</div>
            <div class="text-sm text-gray-500 mt-2">Connected Sources</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-yellow-500">{{sourcesWithIssues}}</div>
            <div class="text-sm text-gray-500 mt-2">Sources with Issues</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-gray-800">{{totalSources}}</div>
            <div class="text-sm text-gray-500 mt-2">Total Sources</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-red-600">{{dataSyncSuccess}}%</div>
            <div class="text-sm text-gray-500 mt-2">Data Sync Success</div>
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <input type="text" 
                 placeholder="Search data sources..." 
                 class="flex-1 max-w-md border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-red-500 focus:border-red-500" />
          <div class="flex gap-2">
            <button class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors">
              Filter
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 transition-colors"
                    (click)="refreshSources.emit()">
              Refresh
            </button>
          </div>
        </div>

        <!-- Data Sources Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">System</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (source of dataSources; track source.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{source.system}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <!-- FIXED STATUS LOGIC -->
                    @if (source.status === 'connected') {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ● Connected
                      </span>
                    }
                    @if (source.status === 'issues') {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        ● Issues
                      </span>
                    }
                    @if (source.status === 'disconnected') {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        ● Disconnected
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{source.host}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{formatDate(source.lastSync)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div class="flex gap-3">
                      <button class="hover:text-gray-600 transition-colors" title="Settings">
                        ⚙️
                      </button>
                      <button class="hover:text-blue-600 transition-colors" title="Refresh" 
                              (click)="refreshSource.emit(source.id)">
                        🔄
                      </button>
                      <button class="hover:text-red-600 transition-colors" title="Delete" 
                              (click)="deleteSource.emit(source.id)">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    <div class="text-4xl mb-4">📊</div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No data sources found</h3>
                    <p class="text-gray-600 mb-6">Get started by adding your first data source.</p>
                    <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                            (click)="addSource.emit()">
                      Add Data Source
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class DataSourcesOverviewPresentationComponent {
  @Input() connectedSources!: number;
  @Input() sourcesWithIssues!: number;
  @Input() totalSources!: number;
  @Input() dataSyncSuccess!: number;
  @Input() dataSources!: any[];
  @Input() isLoading = false;
  @Input() error: string | null = null;
  
  @Output() addSource = new EventEmitter<void>();
  @Output() deleteSource = new EventEmitter<string>();
  @Output() refreshSource = new EventEmitter<string>();
  @Output() refreshSources = new EventEmitter<void>();
  @Output() errorDismiss = new EventEmitter<void>();

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  }
}