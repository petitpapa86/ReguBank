import { ioFunctions } from './io.functions';

export const apiFunctions = {
  loadDataSources: () => ioFunctions.httpGet('http://localhost:3000/dataSources'),
  createDataSource: (dataSource: any) => ioFunctions.httpPost('http://localhost:3000/dataSources', dataSource),
  updateDataSource: (id: string, dataSource: any) => ioFunctions.httpPut(`http://localhost:3000/dataSources/${id}`, dataSource),
  httpDelete: (url: string) => ioFunctions.httpDelete(url),
  deleteDataSource: (id: string) => ioFunctions.httpDelete(`http://localhost:3000/dataSources/${id}`)
};