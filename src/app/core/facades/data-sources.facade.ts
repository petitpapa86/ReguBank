import { Injectable, signal, computed, effect } from '@angular/core';
import { DataSource, CreateDataSourceRequest } from '../models/data-source.model';
import {
  createListDataSourcesUseCase,
  createCreateDataSourceUseCase,
  createUpdateDataSourceUseCase,
  createDeleteDataSourceUseCase
} from '../use-cases/data-sources-crud.usecase';

// src/app/core/facades/data-sources.facade.ts
@Injectable({ providedIn: 'root' })
export class DataSourcesFacade {
  private readonly listDataSourcesUseCase = createListDataSourcesUseCase();
  private readonly createDataSourceUseCase = createCreateDataSourceUseCase();
  private readonly updateDataSourceUseCase = createUpdateDataSourceUseCase();
  private readonly deleteDataSourceUseCase = createDeleteDataSourceUseCase();
  
  private readonly _dataVersion = signal(0);
  private readonly _cachedDataSources = signal<DataSource[]>([]);
  private readonly _cachedError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly lastError = signal<string | null>(null);

  // Computed properties
  readonly dataSources = computed(() => {
    this._dataVersion(); // Subscribe to changes
    return this._cachedDataSources();
  });

  readonly connectedSources = computed(() => 
    this.dataSources().filter(ds => ds.status === 'connected').length
  );

  readonly sourcesWithIssues = computed(() => 
    this.dataSources().filter(ds => ds.status === 'issues').length
  );

  readonly totalSources = computed(() => this.dataSources().length);

  readonly disconnectedSources = computed(() => 
    this.dataSources().filter(ds => ds.status === 'disconnected').length
  );

  // Effect handles async operations
  private _loadEffect = effect(async () => {
    const version = this._dataVersion();
    if (version > 0) {
      await this._performLoad();
    }
  });

  // Effect to sync cached error to public error
  private _errorEffect = effect(() => {
    const error = this._cachedError();
    this.lastError.set(error);
  });

  constructor() {
    // Initialize data loading
    this.loadDataSources();
  }

  private async _performLoad() {
    this.isLoading.set(true);
    try {
      const result = await this.listDataSourcesUseCase();
      this._cachedDataSources.set(result);
      this._cachedError.set(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data sources';
      this._cachedError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Public methods
  loadDataSources() {
    this._dataVersion.update(v => v + 1);
  }

  async addDataSource(dataSource: CreateDataSourceRequest) {
    this.isLoading.set(true);
    this._cachedError.set(null);
    
    try {
      await this.createDataSourceUseCase(dataSource);
      // Refresh data after successful creation
      this.loadDataSources();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create data source';
      this._cachedError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteDataSource(id: string) {
    this.isLoading.set(true);
    try {
      await this.deleteDataSourceUseCase(id);
      this.loadDataSources();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete data source';
      this._cachedError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  clearError() {
    this._cachedError.set(null);
    this.lastError.set(null);
  }
}