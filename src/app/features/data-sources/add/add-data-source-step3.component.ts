import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDataSourceStepperComponent } from './add-data-source-stepper.component';

// src/app/features/data-sources/add/add-data-source-step3.component.ts
@Component({
  selector: 'app-add-data-source-step3',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-8">
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Review and Publish</h3>
        <p class="text-gray-600">Please review the details below before publishing your new data source.</p>
      </div>

      <!-- Configuration Summary -->
      <div class="space-y-6 mb-8">
        <!-- Database Connection -->
        <div class="border-b border-gray-200 pb-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Database Connection</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-500">Type:</span>
              <span class="ml-2 font-medium">{{dbType}}</span>
            </div>
            <div>
              <span class="text-gray-500">Host:</span>
              <span class="ml-2 font-medium">{{host}}:{{port}}</span>
            </div>
            <div>
              <span class="text-gray-500">Database:</span>
              <span class="ml-2 font-medium">{{selectedTable}}</span>
            </div>
            <div>
              <span class="text-gray-500">Table:</span>
              <span class="ml-2 font-medium">{{selectedTable}}</span>
            </div>
          </div>
        </div>

        <!-- Data Configuration -->
        <div class="border-b border-gray-200 pb-4">
          <h4 class="text-md font-medium text-gray-900 mb-3">Data Configuration</h4>
          <div class="text-sm space-y-2">
            <div>
              <span class="text-gray-500">Fields:</span>
              <div class="mt-1">
                <div class="flex flex-wrap gap-2">
                  @for (field of selectedFields; track field) {
                    <span class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {{field}}
                    </span>
                  }
                </div>
              </div>
            </div>
            <div>
              <span class="text-gray-500">Sync Frequency:</span>
              <span class="ml-2 font-medium">{{syncFrequency}}</span>
            </div>
            @if (transformationRules) {
              <div>
                <span class="text-gray-500">Transformation Rules:</span>
                <div class="mt-1 p-2 bg-gray-50 rounded text-xs font-mono">
                  {{transformationRules}}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Security Notice -->
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div class="flex">
            <div class="text-blue-400">🔒</div>
            <div class="ml-3">
              <h4 class="text-sm font-medium text-blue-800">Security Notice</h4>
              <p class="mt-1 text-sm text-blue-700">
                Connection credentials will be securely encrypted and stored. 
                Data synchronization will follow your organization's security policies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-4">
        <button type="button" 
                class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-6 rounded-md" 
                [disabled]="isPublishing"
                (click)="back.emit()">
          Back
        </button>
        <button type="button" 
                class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-md disabled:opacity-50" 
                [disabled]="isPublishing"
                (click)="publish.emit()">
          @if (isPublishing) {
            <span class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Publishing...
            </span>
          } @else {
            Publish Data Source
          }
        </button>
      </div>
    </div>
  `
})
export class AddDataSourceStep3Component {
  @Input() dbType!: string;
  @Input() host!: string;
  @Input() port!: string;
  @Input() selectedTable!: string;
  @Input() selectedFields!: string[];
  @Input() syncFrequency!: string;
  @Input() transformationRules!: string;
  @Input() isPublishing = false;
  
  @Output() publish = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}