import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDataSourceStepperComponent } from './add-data-source-stepper.component';

@Component({
  selector: 'app-add-data-source-step3',
  standalone: true,
  imports: [CommonModule, AddDataSourceStepperComponent],
  template: `
    <div class="max-w-2xl mx-auto">
      <app-add-data-source-stepper [step]="3" stepLabel="Review & Publish"></app-add-data-source-stepper>
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Review and Publish</h2>
        <p class="text-gray-600 mb-6">Please review the details below before publishing your new database source.</p>
        <div class="mb-6">
          <div class="font-semibold mb-2">Database Type</div>
          <div class="mb-2">{{dbType}}</div>
          <div class="font-semibold mb-2">Host</div>
          <div class="mb-2">{{host}}</div>
          <div class="font-semibold mb-2">Port</div>
          <div class="mb-2">{{port}}</div>
          <div class="font-semibold mb-2">Table</div>
          <div class="mb-2">{{selectedTable}}</div>
          <div class="font-semibold mb-2">Fields</div>
          <div class="mb-2">{{selectedFields.join(', ')}}</div>
          <div class="font-semibold mb-2">Sync Frequency</div>
          <div class="mb-2">{{syncFrequency}}</div>
          <div class="font-semibold mb-2">Transformation Rules</div>
          <div class="mb-2">{{transformationRules}}</div>
        </div>
        <div class="flex gap-4 mt-8">
          <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded w-full" (click)="back.emit()">Back</button>
          <button type="button" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full" (click)="publish.emit()">Publish</button>
        </div>
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
  @Output() publish = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
}
