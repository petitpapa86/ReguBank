export interface DataSource {
  id: string;
  system: string;
  status: 'connected' | 'disconnected' | 'issues';
  host: string;
  port?: string;
  database?: string;
  username?: string;
  lastSync: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDataSourceRequest {
  system: string;
  dbType: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  selectedTable: string;
  selectedFields: string[];
  syncFrequency: string;
  transformationRules: string;
}