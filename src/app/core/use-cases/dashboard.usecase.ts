import { DashboardData } from '../models/dashboard.model';
import { apiFunctions } from '../functions/api.functions';

export function createLoadDashboardUseCase(): () => Promise<DashboardData> {
  return async () => {
    return await apiFunctions.loadDashboard()();
  };
}
