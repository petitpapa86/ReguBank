import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagementOverviewPresentationComponent } from './file-management-overview-presentation.component';
import { FileManagementFacade } from '../../../core/facades/file-management.facade';

@Component({
  selector: 'app-file-management-overview-container',
  imports: [CommonModule, FileManagementOverviewPresentationComponent],
  template: `
    <app-file-management-overview-presentation
      [files]="filteredFiles()"
      [isLoading]="isLoading()"
      [error]="error()"
      [statusFilter]="statusFilter()"
      [periodFilter]="periodFilter()"
      [typeFilter]="typeFilter()"
      [searchFilter]="searchFilter()"
      (statusFilterChange)="setStatusFilter($event)"
      (periodFilterChange)="setPeriodFilter($event)"
      (typeFilterChange)="setTypeFilter($event)"
      (searchFilterChange)="setSearchFilter($event)"
      (refresh)="refresh()"
    />
  `
})
export class FileManagementOverviewContainerComponent {
  facade = inject(FileManagementFacade) as FileManagementFacade;
  files = computed(() => this.facade.files());
  isLoading = computed(() => this.facade.isLoading());
  error = computed(() => this.facade.error());

  statusFilter = signal('Tutti');
  periodFilter = signal('Ultimo mese');
  typeFilter = signal('Tutti i formati');
  searchFilter = signal('');

  filteredFiles = computed(() => {
    let result = this.files();
    // Status filter
    if (this.statusFilter() !== 'Tutti') {
      result = result.filter(f => {
        if (this.statusFilter() === 'Completati') return f.status?.toLowerCase().includes('completato') || f.status?.toLowerCase().includes('conforme');
        if (this.statusFilter() === 'In Elaborazione') return f.status?.toLowerCase().includes('elaborazione') || f.status?.toLowerCase().includes('in corso');
        if (this.statusFilter() === 'Con Errori') return f.status?.toLowerCase().includes('errore');
        return true;
      });
    }
    // Type filter
    if (this.typeFilter() !== 'Tutti i formati') {
      if (this.typeFilter() === 'Excel (.xlsx)') result = result.filter(f => f.name?.endsWith('.xlsx'));
      if (this.typeFilter() === 'CSV (.csv)') result = result.filter(f => f.name?.endsWith('.csv'));
    }
    // Search filter
    if (this.searchFilter()) {
      const term = this.searchFilter().toLowerCase();
      result = result.filter(f => f.name?.toLowerCase().includes(term));
    }
    // Period filter (not implemented, just pass through)
    return result;
  });

  constructor() {
    this.facade.loadFiles();
  }

  setStatusFilter(value: string) { this.statusFilter.set(value); }
  setPeriodFilter(value: string) { this.periodFilter.set(value); }
  setTypeFilter(value: string) { this.typeFilter.set(value); }
  setSearchFilter(value: string) { this.searchFilter.set(value); }

  refresh() {
    this.facade.loadFiles();
  }
}
