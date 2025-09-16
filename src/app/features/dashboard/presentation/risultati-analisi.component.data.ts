// Data model for Risultati Analisi page
export interface RisultatiAnalisiData {
  fileName: string;
  fileSize: string;
  totalRecords: number;
  complianceScore: number;
  dataQuality: number;
  criticalViolations: number;
  largeExposures: number;
  violations: Array<{
    title: string;
    severity: 'CRITICA' | 'ALTA' | 'MEDIA';
    description: string;
    details: Record<string, string | number>;
  }>;
  topExposures: Array<{
    counterparty: string;
    exposure: string;
    percent: string;
    status: string;
  }>;
  recommendedActions: Array<{
    title: string;
    description: string;
    deadline: string;
    priority: string;
    color: string;
  }>;
}
