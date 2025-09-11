import { apiFunctions } from '../functions/api.functions';
export const createListDataSourcesUseCase = () => {
  return async () => {
    const loadDataSources = apiFunctions.loadDataSources();
    return await loadDataSources();
  };
};