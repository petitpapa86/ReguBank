import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AddDataSourceStep1Component } from './add-data-source-step1.component';
import { AddDataSourceStep2Component } from './add-data-source-step2.component';
import { AddDataSourceStep3Component } from './add-data-source-step3.component';
import { DataSourcesFacade } from '../../../core/facades/data-sources.facade';
import { CreateDataSourceRequest } from '../../../core/models/data-source.model';

@Component({
  selector: 'app-add-data-source-container',
  standalone: true,
  imports: [CommonModule, AddDataSourceStep1Component, AddDataSourceStep2Component, AddDataSourceStep3Component],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <div class="bg-yellow-100 text-yellow-800 p-2 mb-4 rounded">Container component is rendering!</div>
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
          (publish)="onPublish()"
          (back)="prevStep()"
        ></app-add-data-source-step3>
      }
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
