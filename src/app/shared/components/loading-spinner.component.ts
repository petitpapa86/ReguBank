import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isLoading) {
      <div class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span class="ml-2 text-gray-600">{{ message }}</span>
      </div>
    }
  `
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
  @Input() message = 'Loading...';
}