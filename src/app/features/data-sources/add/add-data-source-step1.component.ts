import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// src/app/features/data-sources/add/add-data-source-step1.component.ts
@Component({
  selector: 'app-add-data-source-step1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-8">
      <form (ngSubmit)="nextStep()">
        <!-- REMOVED: AddDataSourceStepperComponent - no more double headers -->
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Database Type</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            @for (dbType of databaseTypes; track dbType) {
              <label class="border rounded-lg p-4 flex items-center cursor-pointer hover:border-red-300 transition-colors"
                     [class.border-red-600]="this.dbType === dbType"
                     [class.bg-red-50]="this.dbType === dbType">
                <input type="radio" 
                       name="dbType" 
                       [value]="dbType" 
                       [(ngModel)]="this.dbType" 
                       class="mr-3 text-red-600" />
                <span class="font-medium">{{dbType}}</span>
              </label>
            }
          </div>
        </div>

        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Connection Details</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Host *</label>
              <input type="text" 
                     [(ngModel)]="host" 
                     name="host" 
                     required
                     class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                     placeholder="e.g., localhost" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Port *</label>
              <input type="text" 
                     [(ngModel)]="port" 
                     name="port" 
                     required
                     class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                     placeholder="e.g., 5432" />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Database Name *</label>
              <input type="text" 
                     [(ngModel)]="database" 
                     name="database" 
                     required
                     class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                     placeholder="e.g., mydatabase" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username *</label>
              <input type="text" 
                     [(ngModel)]="username" 
                     name="username" 
                     required
                     class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                     placeholder="Database username" />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" 
                   [(ngModel)]="password" 
                   name="password" 
                   required
                   class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                   placeholder="Database password" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button type="button" 
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md disabled:opacity-50" 
                  [disabled]="isSubmitting" 
                  (click)="onTestConnection()">
            @if (isSubmitting) {
              <span class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </span>
            } @else {
              Test Connection
            }
          </button>
          
          <button type="submit" 
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md disabled:opacity-50" 
                  [disabled]="!success || isSubmitting">
            Next Step
          </button>
        </div>

        <!-- Success/Error Messages -->
        @if (success) {
          <div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-800">✓ Connection successful! You can proceed to the next step.</p>
          </div>
        }
      </form>
    </div>
  `
})
export class AddDataSourceStep1Component {
  @Input() dbType!: string;
  @Input() host!: string;
  @Input() port!: string;
  @Input() database!: string;
  @Input() username!: string;
  @Input() password!: string;
  @Input() isSubmitting!: boolean;
  @Input() success!: boolean;
  @Input() error!: string | null;
  
  @Output() testConnection = new EventEmitter<boolean>();
  @Output() next = new EventEmitter<any>();

  databaseTypes = ['Oracle', 'SQL Server', 'PostgreSQL', 'MySQL', 'MongoDB', 'Other'];

  onTestConnection() {
    this.testConnection.emit(true);
  }

  nextStep() {
    this.next.emit({
      dbType: this.dbType,
      host: this.host,
      port: this.port,
      database: this.database,
      username: this.username,
      password: this.password
    });
  }
}
