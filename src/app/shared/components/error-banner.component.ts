import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <div class="flex">
        <div class="text-red-400">⚠️</div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="mt-1 text-sm text-red-700">{{ error }}</p>
        </div>
        <button *ngIf="dismissible"
                (click)="dismiss.emit()"
                class="ml-auto text-red-400 hover:text-red-600">
          ✕
        </button>
      </div>
    </div>
  `
})
export class ErrorBannerComponent {
  @Input() error: string | null = null;
  @Input() dismissible = true;
  @Output() dismiss = new EventEmitter<void>();
}
