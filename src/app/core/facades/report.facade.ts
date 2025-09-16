import { Injectable, signal, computed, effect } from '@angular/core';
import { Report, CreateReportRequest, UpdateReportRequest } from '../models/report.model';
import { listReports, createReport, updateReport, deleteReport } from '../use-cases/report-crud.usecase';

@Injectable({ providedIn: 'root' })
export class ReportFacade {
  private _reports = signal<Report[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly reports = computed(() => this._reports());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  constructor() {
    this.loadReports();
  }

  async loadReports() {
    this._loading.set(true);
    this._error.set(null);
    try {
      const data = await listReports();
      this._reports.set(data);
    } catch (err: any) {
      this._error.set(err.message || 'Errore caricamento reports');
    } finally {
      this._loading.set(false);
    }
  }

  async addReport(report: CreateReportRequest) {
    this._loading.set(true);
    try {
      const newReport = await createReport(report);
      this._reports.set([...this._reports(), newReport]);
    } finally {
      this._loading.set(false);
    }
  }

  async updateReport(id: string, report: UpdateReportRequest) {
    this._loading.set(true);
    try {
      const updated = await updateReport(id, report);
      this._reports.set(this._reports().map(r => r.id === id ? updated : r));
    } finally {
      this._loading.set(false);
    }
  }

  async deleteReport(id: string) {
    this._loading.set(true);
    try {
      await deleteReport(id);
      this._reports.set(this._reports().filter(r => r.id !== id));
    } finally {
      this._loading.set(false);
    }
  }
}
