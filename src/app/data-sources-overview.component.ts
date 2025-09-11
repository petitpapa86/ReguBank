import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { apiFunctions } from './core/functions/api.functions';

interface DataSource {
  id: number;
  system: string;
  status: 'connected' | 'issues' | 'disconnected';
  host: string;
  lastSync: string;
}

@Component({
  selector: 'app-data-sources-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <nav class="bg-white shadow-sm border-b px-8 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <span class="font-bold text-xl text-gray-900">ComplianceConnect</span>
          <span class="text-gray-600">Integrations</span>
        </div>
        <div class="flex items-center gap-4">
          <input type="text" placeholder="Search" class="border border-gray-300 rounded px-3 py-1 text-sm" />
          <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-700 font-bold">A</span>
          </div>
        </div>
      </nav>
      <div class="max-w-5xl mx-auto py-8 px-4">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Data Sources Overview</h1>
        <p class="text-gray-600 mb-6">Manage and monitor all your banking system integrations.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <span class="text-green-600 text-2xl font-bold">{{ connectedCount() }}</span>
            <span class="text-xs text-gray-500 mt-2">Connected Sources</span>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <span class="text-yellow-500 text-2xl font-bold">{{ issuesCount() }}</span>
            <span class="text-xs text-gray-500 mt-2">Sources with Issues</span>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <span class="text-gray-900 text-2xl font-bold">{{ totalCount() }}</span>
            <span class="text-xs text-gray-500 mt-2">Total Sources</span>
          </div>
          <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
            <div class="w-full flex items-center gap-2">
              <div class="w-full h-2 bg-gray-200 rounded-full">
                <div class="h-2 rounded-full bg-red-500" [style.width.%]="syncSuccessPercent()"></div>
              </div>
              <span class="text-red-600 font-bold">{{ syncSuccessPercent() }}%</span>
            </div>
            <span class="text-xs text-gray-500 mt-2">Data Sync Success</span>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <input type="text" placeholder="Search data sources..." class="border border-gray-300 rounded px-3 py-1 text-sm w-64" />
            <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">+ Add Data Source</button>
          </div>
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 text-gray-500">System</th>
                <th class="text-left py-2 text-gray-500">Status</th>
                <th class="text-left py-2 text-gray-500">Host</th>
                <th class="text-left py-2 text-gray-500">Last Sync</th>
                <th class="py-2"></th>
              </tr>
            </thead>
            <tbody>
              @for (ds of dataSources(); track ds.id) {
                <tr class="border-b hover:bg-gray-50" [class.bg-red-50]="ds.status === 'disconnected'">
                  <td class="py-2 font-semibold text-gray-900">{{ ds.system }}</td>
                  <td class="py-2">
                    <span *ngIf="ds.status === 'connected'" class="inline-flex items-center px-2 py-1 rounded text-green-600 bg-green-100 text-xs font-medium">● Connected</span>
                    <span *ngIf="ds.status === 'issues'" class="inline-flex items-center px-2 py-1 rounded text-yellow-600 bg-yellow-100 text-xs font-medium">● Issues</span>
                    <span *ngIf="ds.status === 'disconnected'" class="inline-flex items-center px-2 py-1 rounded text-red-600 bg-red-100 text-xs font-medium">● Disconnected</span>
                  </td>
                  <td class="py-2 text-gray-700">{{ ds.host }}</td>
                  <td class="py-2 text-gray-700">{{ formatDate(ds.lastSync) }}</td>
                  <td class="py-2 text-right">
                    <button class="text-gray-400 hover:text-gray-700"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      <footer class="text-center py-6 text-xs text-gray-400">© 2024 ComplianceConnect. All rights reserved.</footer>
    </div>
  `
})
export class DataSourcesOverviewComponent {
  private readonly _dataSources = signal<DataSource[]>([]);

  constructor() {
    this.loadDataSources();
  }

  loadDataSources() {
    apiFunctions.loadDataSources()().then((data: DataSource[]) => {
      this._dataSources.set(data);
    });
  }

  dataSources = computed(() => this._dataSources());

  connectedCount = computed(() => this._dataSources().filter(ds => ds.status === 'connected').length);
  issuesCount = computed(() => this._dataSources().filter(ds => ds.status === 'issues').length);
  totalCount = computed(() => this._dataSources().length);
  syncSuccessPercent = computed(() => {
    const total = this._dataSources().length;
    const connected = this._dataSources().filter(ds => ds.status === 'connected').length;
    return total ? Math.round((connected / total) * 100) : 0;
  });

  formatDate(date: string) {
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
