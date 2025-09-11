import { Injectable, signal, computed, effect } from '@angular/core';
import { DataSource, CreateDataSourceRequest } from '../models/data-source.model';
import {
  createListDataSourcesUseCase,
  createCreateDataSourceUseCase,
  createUpdateDataSourceUseCase,
  createDeleteDataSourceUseCase
} from '../use-cases/data-sources-crud.usecase';

@Injectable({ providedIn: 'root' })
export class DataSourcesFacade {
  listDataSourcesUseCase = createListDataSourcesUseCase();
  createDataSourceUseCase = createCreateDataSourceUseCase();
  updateDataSourceUseCase = createUpdateDataSourceUseCase();
  deleteDataSourceUseCase = createDeleteDataSourceUseCase();
  private readonly _dataVersion = signal(0);
  private readonly _cachedDataSources = signal<DataSource[]>([]);
  private readonly _cachedError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly lastError = signal<string | null>(null);

  // Computed properties
  readonly dataSources = computed(() => {
    this._dataVersion();
    return this._cachedDataSources();
  });

  readonly connectedSources = computed(() => 
    this.dataSources().filter(ds => ds.status === 'connected').length
  );

  readonly sourcesWithIssues = computed(() => 
    this.dataSources().filter(ds => ds.status === 'issues').length
  );

  readonly totalSources = computed(() => this.dataSources().length);

  // Add proper error handling and loading states
  private _loadEffect = effect(async () => {
    if (this._dataVersion() > 0) {
      this.isLoading.set(true);
      try {
        const result = await this.listDataSourcesUseCase();
        this._cachedDataSources.set(result);
        this._cachedError.set(null);
      } catch (error) {
        this._cachedError.set(error instanceof Error ? error.message : 'Failed to load data sources');
      } finally {
        this.isLoading.set(false);
      }
    }
  });

  // Public methods
  async addDataSource(dataSource: CreateDataSourceRequest) {
    this.isLoading.set(true);
    try {
      await this.createDataSourceUseCase(dataSource);
      await this.loadDataSources();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create data source';
      this.lastError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateDataSource(id: string, dataSource: DataSource) {
    this.isLoading.set(true);
    try {
      await this.updateDataSourceUseCase(id, dataSource);
      await this.loadDataSources();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update data source';
      this.lastError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteDataSource(id: string) {
    this.isLoading.set(true);
    try {
      await this.deleteDataSourceUseCase(id);
      await this.loadDataSources();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete data source';
      this.lastError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadDataSources() {
    this.isLoading.set(true);
    try {
      const result = await this.listDataSourcesUseCase();
      this._cachedDataSources.set(result);
      this._cachedError.set(null);
    } catch (error) {
      this._cachedError.set(error instanceof Error ? error.message : 'Failed to load data sources');
    } finally {
      this.isLoading.set(false);
    }
  }
}