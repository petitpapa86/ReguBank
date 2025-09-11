import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddDataSourceStepperComponent } from './add-data-source-stepper.component';

@Component({
  selector: 'app-add-data-source-step2',
  standalone: true,
  imports: [CommonModule, FormsModule, AddDataSourceStepperComponent],
  template: `
    <div class="max-w-2xl mx-auto">
      <app-add-data-source-stepper [step]="2" stepLabel="Data Configuration"></app-add-data-source-stepper>
      <div class="bg-white rounded-lg shadow-md p-8">
        <form (ngSubmit)="nextStep()">
          <div class="mb-6">
            <div class="font-semibold mb-2">Select Table</div>
            <input type="text" [(ngModel)]="selectedTable" name="selectedTable" class="border rounded px-3 py-2 w-full mb-4" placeholder="e.g., transactions" />
            <div class="font-semibold mb-2">Select Fields</div>
            <input type="text" [(ngModel)]="selectedFieldsStr" name="selectedFields" class="border rounded px-3 py-2 w-full mb-4" placeholder="e.g., id, amount, date" />
          </div>
          <div class="mb-6">
            <div class="font-semibold mb-2">Sync Frequency</div>
            <select [(ngModel)]="syncFrequency" name="syncFrequency" class="border rounded px-3 py-2 w-full">
              <option value="Hourly">Hourly</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <div class="mb-6">
            <div class="font-semibold mb-2">Transformation Rules</div>
            <textarea [(ngModel)]="transformationRules" name="transformationRules" class="border rounded px-3 py-2 w-full" rows="3" placeholder="e.g., map fields, filter rows"></textarea>
          </div>
          <div class="flex gap-4 mt-8">
            <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded w-full" (click)="back.emit()">Back</button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Next</button>
          </div>
        </form>
      </div>
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
