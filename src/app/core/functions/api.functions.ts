import { ioFunctions } from './io.functions';

export const apiFunctions = {
  loadDataSources: () => ioFunctions.httpGet('http://localhost:3000/dataSources')
};