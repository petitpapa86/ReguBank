export interface DashboardStats {
  lastUpdated: string;
  filesProcessed: number;
  filesGrowth: number;
  avgScore: number;
  scoreGrowth: number;
  violations: number;
  violationsChange: number;
  reportsGenerated: number;
  lastReport: string;
}

export interface DashboardFile {
  name: string;
  date: string;
  records: string;
  compliance: number | string;
  status: string;
}

export interface DashboardReport {
  name: string;
  details: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentFiles: DashboardFile[];
  recentReports: DashboardReport[];
}
