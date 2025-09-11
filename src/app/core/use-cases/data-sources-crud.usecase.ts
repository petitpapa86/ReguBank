import { DataSource, CreateDataSourceRequest } from '../models/data-source.model';

export function createListDataSourcesUseCase(): () => Promise<DataSource[]> {
  return async () => {
    // TODO: Replace with actual API call
    return [];
  };
}

export function createCreateDataSourceUseCase(): (data: CreateDataSourceRequest) => Promise<void> {
  return async (data: CreateDataSourceRequest) => {
    // TODO: Replace with actual API call
  };
}

export function createUpdateDataSourceUseCase(): (id: string, data: DataSource) => Promise<void> {
  return async (id: string, data: DataSource) => {
    // TODO: Replace with actual API call
  };
}

export function createDeleteDataSourceUseCase(): (id: string) => Promise<void> {
  return async (id: string) => {
    // TODO: Replace with actual API call
  };
}
