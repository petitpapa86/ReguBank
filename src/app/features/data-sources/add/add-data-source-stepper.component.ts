import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-data-source-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-4">
      <h2 class="text-xl font-semibold text-center mb-1">Add New Data Source</h2>
      <p class="text-gray-500 text-center mb-4">Connect to your database to start importing data.</p>
      <div class="max-w-xl mx-auto">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm font-medium">Step {{step}} of 3</div>
          <div class="text-sm text-gray-400">{{stepLabel}}</div>
        </div>
        <div class="w-full h-1 bg-gray-200 rounded">
          <div class="h-1 bg-red-600 rounded" [style.width]="progress + '%'" style="transition:width 0.3s"></div>
        </div>
      </div>
    </div>
  `
})
export class AddDataSourceStepperComponent {
  @Input() step: number = 1;
  @Input() stepLabel: string = '';
  get progress() {
    return this.step === 1 ? 33 : this.step === 2 ? 66 : 100;
  }
}
