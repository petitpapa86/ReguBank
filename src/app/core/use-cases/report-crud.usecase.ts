import { Report, CreateReportRequest, UpdateReportRequest } from '../models/report.model';
import { apiFunctions } from '../functions/api.functions';

export function listReports(): Promise<Report[]> {
  return apiFunctions.getReports()();
}

export function createReport(data: CreateReportRequest): Promise<Report> {
  return apiFunctions.createReport(data)();
}

export function updateReport(id: string, data: UpdateReportRequest): Promise<Report> {
  return apiFunctions.updateReport(id, data)();
}

export function deleteReport(id: string): Promise<void> {
  return apiFunctions.deleteReport(id)();
}
