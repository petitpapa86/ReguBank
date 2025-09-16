import { Injectable, signal, computed, effect } from '@angular/core';
import { DashboardData } from '../models/dashboard.model';
import { createLoadDashboardUseCase } from '../use-cases/dashboard.usecase';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly loadUseCase = createLoadDashboardUseCase();
  private readonly _dataVersion = signal(0);
  private readonly _cachedData = signal<DashboardData | null>(null);
  private readonly _cachedError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly lastError = signal<string | null>(null);

  readonly dashboardData = computed(() => this._cachedData());
  readonly stats = computed(() => this._cachedData()?.stats ?? null);
  readonly recentFiles = computed(() => this._cachedData()?.recentFiles ?? []);
  readonly recentReports = computed(() => this._cachedData()?.recentReports ?? []);

  private _loadEffect = effect(async () => {
    if (this._dataVersion() > 0) {
      await this._performLoad();
    }
  });

  private _errorEffect = effect(() => {
    this.lastError.set(this._cachedError());
  });

  constructor() {
    this.loadDashboard();
  }

  private async _performLoad() {
    this.isLoading.set(true);
    try {
      const result = await this.loadUseCase();
      this._cachedData.set(result);
      this._cachedError.set(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard';
      this._cachedError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  loadDashboard() {
    this._dataVersion.update(v => v + 1);
  }

  clearError() {
    this._cachedError.set(null);
    this.lastError.set(null);
  }
}
