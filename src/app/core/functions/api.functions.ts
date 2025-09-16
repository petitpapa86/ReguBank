import { DashboardData } from '../models/dashboard.model';
import { ioFunctions } from './io.functions';

export const apiFunctions = {
  loadDashboard: () => ioFunctions.httpGet<DashboardData>('http://localhost:3000/dashboard'),
};
