import { Injectable, signal, computed, effect } from '@angular/core';
import { FileProcessing } from '../models/file-processing.model';
import { createLoadFileProcessingUseCase } from '../use-cases/file-processing.usecase';

@Injectable({ providedIn: 'root' })
export class FileProcessingFacade {
  private readonly loadUseCase = createLoadFileProcessingUseCase();
  private readonly _dataVersion = signal(0);
  private readonly _cachedData = signal<FileProcessing | null>(null);
  private readonly _cachedError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly lastError = signal<string | null>(null);

  readonly data = computed(() => {
    this._dataVersion();
    return this._cachedData();
  });

  private _loadEffect = effect(async () => {
    const version = this._dataVersion();
    if (version > 0) {
      await this._performLoad();
    }
  });

  private _errorEffect = effect(() => {
    const error = this._cachedError();
    this.lastError.set(error);
  });

  constructor() {
    this.load();
  }

  private async _performLoad() {
    this.isLoading.set(true);
    try {
      const result = await this.loadUseCase();
      this._cachedData.set(result);
      this._cachedError.set(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load file processing data';
      this._cachedError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  load() {
    this._dataVersion.update(v => v + 1);
  }

  clearError() {
    this._cachedError.set(null);
    this.lastError.set(null);
  }
}
