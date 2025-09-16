import { DashboardData } from '../models/dashboard.model';
import { Report, CreateReportRequest, UpdateReportRequest } from '../models/report.model';
import { ioFunctions } from './io.functions';

export const apiFunctions = {
  loadDashboard: () => ioFunctions.httpGet<DashboardData>('http://localhost:3000/dashboard'),
  getReports: () => ioFunctions.httpGet<Report[]>('http://localhost:3000/reports'),
  createReport: (data: CreateReportRequest) => ioFunctions.httpPost<Report>('http://localhost:3000/reports', data),
  updateReport: (id: string, data: UpdateReportRequest) => ioFunctions.httpPut<Report>(`http://localhost:3000/reports/${id}`, data),
  deleteReport: (id: string) => ioFunctions.httpDelete(`http://localhost:3000/reports/${id}`),
};
