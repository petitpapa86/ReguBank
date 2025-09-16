import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FileProcessingFacade } from '../../core/facades/file-processing.facade';

@Component({
  selector: 'app-file-processing',
  templateUrl: './file-processing.component.html',
  styleUrls: ['./file-processing.component.css'],
  imports: [CommonModule, DecimalPipe]
})
export class FileProcessingComponent {
  facade = inject(FileProcessingFacade);
  router = inject(Router);

  readonly data = computed(() => this.facade.data());
  readonly isLoading = computed(() => this.facade.isLoading());
  readonly error = computed(() => this.facade.lastError());

  get progress() { return this.data()?.progress ?? 0; }
  get recordsProcessed() { return this.data()?.recordsProcessed ?? 0; }
  get totalRecords() { return this.data()?.totalRecords ?? 0; }
  get currentStep() { return this.data()?.currentStep ?? ''; }
  get stepDescription() { return this.data()?.stepDescription ?? ''; }
  get qualityScore() { return this.data()?.qualityScore ?? 0; }
  get violationsFound() { return this.data()?.violationsFound ?? 0; }
  get largeExposures() { return this.data()?.largeExposures ?? 0; }
  get fileName() { return this.data()?.fileName ?? ''; }
  get fileSize() { return this.data()?.fileSize ?? ''; }
  get timeRemaining() { return this.data()?.timeRemaining ?? ''; }

  cancelProcessing() {
    if (confirm("Sei sicuro di voler annullare l'elaborazione?")) {
      this.router.navigate(['/dashboard']);
    }
  }

  clearError() {
    this.facade.clearError();
  }
}
