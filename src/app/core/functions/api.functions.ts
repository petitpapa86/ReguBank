import { DashboardData } from '../models/dashboard.model';
import { Report, CreateReportRequest, UpdateReportRequest } from '../models/report.model';
import { FileProcessing } from '../models/file-processing.model';
import { ioFunctions } from './io.functions';
import { Utente } from '../models/utente.model';

export const apiFunctions = {
  loadDashboard: () => ioFunctions.httpGet<DashboardData>('http://localhost:3000/dashboard'),
  getReports: () => ioFunctions.httpGet<Report[]>('http://localhost:3000/reports'),
  createReport: (data: CreateReportRequest) => ioFunctions.httpPost<Report>('http://localhost:3000/reports', data),
  updateReport: (id: string, data: UpdateReportRequest) => ioFunctions.httpPut<Report>(`http://localhost:3000/reports/${id}`, data),
  deleteReport: (id: string) => ioFunctions.httpDelete(`http://localhost:3000/reports/${id}`),
  loadFileProcessing: () => ioFunctions.httpGet<FileProcessing>('http://localhost:3000/fileProcessing'),
  loadUtenti: () => ioFunctions.httpGet<Utente[]>('http://localhost:3000/utenti'),
};
