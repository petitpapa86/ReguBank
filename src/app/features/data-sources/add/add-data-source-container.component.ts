import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddDataSourceStep1Component } from './add-data-source-step1.component';
import { AddDataSourceStep2Component } from './add-data-source-step2.component';
import { AddDataSourceStep3Component } from './add-data-source-step3.component';
import { DataSourcesFacade } from '../../../core/facades/data-sources.facade';
import { CreateDataSourceRequest } from '../../../core/models/data-source.model';
import { ErrorBannerComponent } from '../../../shared/components/error-banner.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-add-data-source-container',
  standalone: true,
  imports: [
    CommonModule, 
    AddDataSourceStep1Component, 
    AddDataSourceStep2Component, 
    AddDataSourceStep3Component,
    LoadingSpinnerComponent,
    ErrorBannerComponent
  ],
  template: `
    <!-- CONSISTENT LAYOUT PATTERN -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <a routerLink="/data-sources" class="hover:text-red-600">Data Sources</a>
            <span class="mx-2">/</span>
          </li>
          <li class="font-semibold text-gray-700">Add Source</li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Add New Data Source</h1>
        <p class="text-gray-600">Connect to your database to start importing data.</p>
      </div>

      <!-- Progress Indicator -->
      <div class="max-w-2xl mx-auto mb-8">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium text-gray-700">Step {{step()}} of 3</div>
          <div class="text-sm text-gray-500">{{currentStepLabel()}}</div>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full">
          <div class="h-2 bg-red-600 rounded-full transition-all duration-300" 
               [style.width]="progress() + '%'">
          </div>
        </div>
      </div>

      <!-- Error Handling -->
      <div class="max-w-2xl mx-auto mb-6">
        <app-error-banner 
          [error]="dataSourcesFacade.lastError()" 
          [dismissible]="true"
          (dismiss)="dataSourcesFacade.clearError()">
        </app-error-banner>
        
        <app-error-banner 
          [error]="error()" 
          [dismissible]="true"
          (dismiss)="error.set(null)">
        </app-error-banner>
      </div>

      <!-- Loading State -->
      <app-loading-spinner 
        [isLoading]="dataSourcesFacade.isLoading()" 
        message="Saving data source...">
      </app-loading-spinner>

      <!-- Step Content -->
      <div class="max-w-2xl mx-auto">
        @if (step() === 1) {
          <app-add-data-source-step1
            [dbType]="dbType()"
            [host]="host()"
            [port]="port()"
            [database]="database()"
            [username]="username()"
            [password]="password()"
            [isSubmitting]="isSubmitting()"
            [success]="success()"
            [error]="error()"
            (testConnection)="onTestConnection($event)"
            (next)="onStep1Next($event)"
          ></app-add-data-source-step1>
        }
        
        @if (step() === 2) {
          <app-add-data-source-step2
            [selectedDatabase]="selectedDatabase()"
            [selectedTable]="selectedTable()"
            [selectedFields]="selectedFields()"
            [syncFrequency]="syncFrequency()"
            [transformationRules]="transformationRules()"
            (fieldsChange)="onFieldsChange($event)"
            (next)="onStep2Next($event)"
            (back)="prevStep()"
          ></app-add-data-source-step2>
        }
        
        @if (step() === 3) {
          <app-add-data-source-step3
            [dbType]="dbType()"
            [host]="host()"
            [port]="port()"
            [selectedTable]="selectedTable()"
            [selectedFields]="selectedFields()"
            [syncFrequency]="syncFrequency()"
            [transformationRules]="transformationRules()"
            [isPublishing]="dataSourcesFacade.isLoading()"
            (publish)="onPublish()"
            (back)="prevStep()"
          ></app-add-data-source-step3>
        }
      </div>
    </div>
  `
})
export class AddDataSourceContainerComponent {
  step = signal(1);
  dbType = signal('Oracle');
  host = signal('');
  port = signal('');
  database = signal('');
  username = signal('');
  password = signal('');
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  // Step 2 state
  selectedDatabase = signal('');
  selectedTable = signal('');
  selectedFields = signal<string[]>([]);
  syncFrequency = signal('Hourly');
  transformationRules = signal('');

  dataSourcesFacade = inject(DataSourcesFacade);
  router = inject(Router);

  currentStepLabel = computed(() => {
    switch (this.step()) {
      case 1: return 'Database Connection';
      case 2: return 'Data Configuration';
      case 3: return 'Review & Publish';
      default: return '';
    }
  });

  progress = computed(() => {
    return this.step() === 1 ? 33 : this.step() === 2 ? 66 : 100;
  });

  constructor() {}

  onTestConnection(valid: boolean) {
    this.success.set(valid);
  }

  onStep1Next(data: any) {
    this.dbType.set(data.dbType);
    this.host.set(data.host);
    this.port.set(data.port);
    this.database.set(data.database);
    this.username.set(data.username);
    this.password.set(data.password);
    this.step.set(2);
  }

  onFieldsChange(fields: string[]) {
    this.selectedFields.set(fields);
  }

  onStep2Next(data: any) {
    this.selectedDatabase.set(data.selectedDatabase);
    this.selectedTable.set(data.selectedTable);
    this.selectedFields.set(data.selectedFields);
    this.syncFrequency.set(data.syncFrequency);
    this.transformationRules.set(data.transformationRules);
    this.step.set(3);
  }

  async onPublish() {
    const dataSourceData: CreateDataSourceRequest = {
      system: this.dbType(),
      dbType: this.dbType(),
      host: this.host(),
      port: this.port(),
      database: this.database(),
      username: this.username(),
      password: this.password(),
      selectedTable: this.selectedTable(),
      selectedFields: this.selectedFields(),
      syncFrequency: this.syncFrequency(),
      transformationRules: this.transformationRules()
    };

    const result = await this.dataSourcesFacade.addDataSource(dataSourceData);
    
    if (result.success) {
      this.router.navigate(['/data-sources']);
    }
    // Error handling is done by the facade
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.set(this.step() - 1);
    }
  }
}
