import { Injectable, signal, computed, effect } from '@angular/core';
import { createListDataSourcesUseCase } from '../use-cases/list-data-sources.usecase';

@Injectable({ providedIn: 'root' })
export class DataSourcesFacade {
  private readonly _dataVersion = signal(0);
  private readonly _cachedDataSources = signal([]);
  readonly dataSources = computed(() => {
    this._dataVersion();
    return this._cachedDataSources();
  });

  private readonly listDataSourcesUseCase = createListDataSourcesUseCase();

  private _loadEffect = effect(async () => {
    if (this._dataVersion() > 0) {
      const result = await this.listDataSourcesUseCase();
      this._cachedDataSources.set(result);
    }
  });

  constructor() {
    this.loadDataSources();
  }

  loadDataSources() {
    this._dataVersion.update(v => v + 1);
  }
}