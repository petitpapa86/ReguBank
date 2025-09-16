export interface Report {
  id: string;
  name: string;
  size: string;
  pages: number;
  format: string;
  template: string;
  language: string;
  status: 'Completato' | 'Inviato' | 'Archiviato';
  generatedAt: string;
  period: string;
}

export interface CreateReportRequest {
  name: string;
  size: string;
  pages: number;
  format: string;
  template: string;
  language: string;
  status: 'Completato' | 'Inviato' | 'Archiviato';
  generatedAt: string;
  period: string;
}

export interface UpdateReportRequest {
  id: string;
  name?: string;
  size?: string;
  pages?: number;
  format?: string;
  template?: string;
  language?: string;
  status?: 'Completato' | 'Inviato' | 'Archiviato';
  generatedAt?: string;
  period?: string;
}
