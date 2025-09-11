import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddDataSourceStepperComponent } from './add-data-source-stepper.component';

// src/app/features/data-sources/add/add-data-source-step2.component.ts
@Component({
  selector: 'app-add-data-source-step2',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-8">
      <form (ngSubmit)="nextStep()">
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Configuration</h3>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Table *</label>
            <input type="text" 
                   [(ngModel)]="selectedTable" 
                   name="selectedTable" 
                   required
                   class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                   placeholder="e.g., transactions" />
            <p class="mt-1 text-sm text-gray-500">Enter the name of the table you want to sync</p>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Select Fields *</label>
            <input type="text" 
                   [(ngModel)]="selectedFieldsStr" 
                   name="selectedFields" 
                   required
                   class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                   placeholder="e.g., id, amount, date, customer_id" />
            <p class="mt-1 text-sm text-gray-500">Enter field names separated by commas</p>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Sync Settings</h3>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sync Frequency *</label>
            <select [(ngModel)]="syncFrequency" 
                    name="syncFrequency" 
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500">
              <option value="Hourly">Every Hour</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Transformation Rules</label>
            <textarea [(ngModel)]="transformationRules" 
                      name="transformationRules" 
                      rows="4"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500" 
                      placeholder="e.g., map customer_id to customerId, filter amount > 0"></textarea>
            <p class="mt-1 text-sm text-gray-500">Optional: Define any data transformation or filtering rules</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button type="button" 
                  class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-3 px-6 rounded-md" 
                  (click)="back.emit()">
            Back
          </button>
          <button type="submit" 
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md">
            Next Step
          </button>
        </div>
      </form>
    </div>
  `
})
export class AddDataSourceStep2Component {
  @Input() selectedDatabase!: string;
  @Input() selectedTable!: string;
  @Input() selectedFields!: string[];
  @Input() syncFrequency!: string;
  @Input() transformationRules!: string;
  
  @Output() fieldsChange = new EventEmitter<string[]>();
  @Output() next = new EventEmitter<any>();
  @Output() back = new EventEmitter<void>();

  get selectedFieldsStr() {
    return this.selectedFields ? this.selectedFields.join(', ') : '';
  }
  
  set selectedFieldsStr(val: string) {
    this.selectedFields = val.split(',').map(f => f.trim()).filter(f => f);
    this.fieldsChange.emit(this.selectedFields);
  }

  nextStep() {
    this.next.emit({
      selectedDatabase: this.selectedDatabase,
      selectedTable: this.selectedTable,
      selectedFields: this.selectedFields,
      syncFrequency: this.syncFrequency,
      transformationRules: this.transformationRules
    });
  }
}