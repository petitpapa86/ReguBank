import { DataSource, CreateDataSourceRequest } from '../models/data-source.model';
import { apiFunctions } from '../functions/api.functions';

export function createListDataSourcesUseCase(): () => Promise<DataSource[]> {
  return async () => {
    return await apiFunctions.loadDataSources()();
  };
}

export function createCreateDataSourceUseCase(): (data: CreateDataSourceRequest) => Promise<void> {
  return async (data: CreateDataSourceRequest) => {
    await apiFunctions.createDataSource(data)();
  };
}

export function createUpdateDataSourceUseCase(): (id: string, data: DataSource) => Promise<void> {
  return async (id: string, data: DataSource) => {
    await apiFunctions.updateDataSource(id, data)();
  };
}

export function createDeleteDataSourceUseCase(): (id: string) => Promise<void> {
  return async (id: string) => {
    await apiFunctions.deleteDataSource(id)();
  };
}
