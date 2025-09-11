import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-sources-overview-presentation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 bg-gray-50 min-h-screen">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">Data Sources Overview</h1>
          <p class="text-gray-500">Manage and monitor all your banking system integrations.</p>
        </div>
        <button class="bg-red-600 text-white px-5 py-2 rounded font-semibold" (click)="addSource.emit()">+ Add Data Source</button>
      </div>
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded p-6 shadow flex flex-col items-center">
          <div class="text-3xl font-bold text-green-600">{{connectedSources}}</div>
          <div class="text-gray-500 mt-2">Connected Sources</div>
        </div>
        <div class="bg-white rounded p-6 shadow flex flex-col items-center">
          <div class="text-3xl font-bold text-yellow-500">{{sourcesWithIssues}}</div>
          <div class="text-gray-500 mt-2">Sources with Issues</div>
        </div>
        <div class="bg-white rounded p-6 shadow flex flex-col items-center">
          <div class="text-3xl font-bold text-gray-800">{{totalSources}}</div>
          <div class="text-gray-500 mt-2">Total Sources</div>
        </div>
        <div class="bg-white rounded p-6 shadow flex flex-col items-center">
          <div class="w-full flex items-center justify-between mb-2">
            <span class="text-gray-500">Data Sync Success</span>
            <span class="text-xl font-bold text-red-600">{{dataSyncSuccess}}%</span>
          </div>
          <div class="w-full h-2 bg-gray-200 rounded">
            <div class="h-2 bg-red-600 rounded" [style.width]="dataSyncSuccess + '%'">
            </div>
          </div>
        </div>
      </div>
      <div class="mb-4 flex items-center gap-2">
        <input type="text" placeholder="Search data sources..." class="border rounded px-4 py-2 w-1/3" />
        <button class="bg-gray-100 px-3 py-2 rounded border">Filter</button>
        <button class="bg-gray-100 px-3 py-2 rounded border"><span class="material-icons">grid_view</span></button>
        <button class="bg-red-100 px-3 py-2 rounded border"><span class="material-icons">view_list</span></button>
      </div>
      <div class="bg-white rounded shadow">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b">
              <th class="px-6 py-3 text-gray-500">SYSTEM</th>
              <th class="px-6 py-3 text-gray-500">STATUS</th>
              <th class="px-6 py-3 text-gray-500">HOST</th>
              <th class="px-6 py-3 text-gray-500">LAST SYNC</th>
              <th class="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let source of dataSources" [ngClass]="{'bg-red-50': source.status === 'Disconnected'}">
              <td class="px-6 py-4 font-semibold">{{source.system}}</td>
              <td class="px-6 py-4">
                <span *ngIf="source.status === 'Connected'" class="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">● Connected</span>
                <span *ngIf="source.status === 'Issues'" class="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm">● Issues</span>
                <span *ngIf="source.status === 'Disconnected'" class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">● Disconnected</span>
              </td>
              <td class="px-6 py-4">{{source.host}}</td>
              <td class="px-6 py-4">{{source.lastSync}}</td>
              <td class="px-6 py-4 flex gap-2">
                <button class="text-gray-400"><span class="material-icons">settings</span></button>
                <button class="text-gray-400"><span class="material-icons">refresh</span></button>
                <button class="text-gray-400"><span class="material-icons">more_vert</span></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DataSourcesOverviewPresentationComponent {
  @Input() connectedSources!: number;
  @Input() sourcesWithIssues!: number;
  @Input() totalSources!: number;
  @Input() dataSyncSuccess!: number;
  @Input() dataSources!: any[];
  @Output() addSource = new EventEmitter<void>();
}
