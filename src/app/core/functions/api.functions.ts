import { FileEntity } from '../models/file.model';

// Simulate fetching files from db.json
export async function filesFromDb(): Promise<FileEntity[]> {
  // Fetch from local json-server (assume running on port 3000)
  const response = await fetch('http://localhost:3000/dashboard');
  const data = await response.json();
  // Map recentFiles from db.json to FileEntity[]
  return (data.recentFiles || []).map((file: any) => ({
    name: file.name,
    size: file.size || 'N/A',
    date: file.date,
    time: file.time || '',
    records: file.records || '-',
    status: file.status || '-',
    quality: typeof file.quality === 'number' ? file.quality : (typeof file.compliance === 'number' ? file.compliance : undefined),
    compliance: typeof file.compliance === 'number' ? file.compliance : undefined,
    violations: file.violations || (file.status && file.status.includes('violazione') ? file.status : '-')
  }));
}
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
