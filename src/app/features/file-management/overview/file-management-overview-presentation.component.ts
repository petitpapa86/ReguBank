// ...existing code...
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-management-overview-presentation',
  imports: [CommonModule],
  templateUrl: './file-management-overview-presentation.component.html',
  styleUrls: ['./file-management-overview-presentation.component.css']
})
export class FileManagementOverviewPresentationComponent {
  get totalFiles(): number {
    return this.files?.length ?? 0;
  }
  get completedFiles(): number {
    return this.files?.filter(f => f.status?.toLowerCase().includes('completato') || f.status?.toLowerCase().includes('conforme'))?.length ?? 0;
  }
  get inProgressFiles(): number {
    return this.files?.filter(f => f.status?.toLowerCase().includes('elaborazione') || f.status?.toLowerCase().includes('in corso'))?.length ?? 0;
  }
  get errorFiles(): number {
    return this.files?.filter(f => f.status?.toLowerCase().includes('errore'))?.length ?? 0;
  }
  @Input() files: any[] = [];
  @Input() isLoading = false;
  @Input() error: string | null = null;

  @Input() statusFilter: string = 'Tutti';
  @Input() periodFilter: string = 'Ultimo mese';
  @Input() typeFilter: string = 'Tutti i formati';
  @Input() searchFilter: string = '';

  @Output() statusFilterChange = new EventEmitter<string>();
  @Output() periodFilterChange = new EventEmitter<string>();
  @Output() typeFilterChange = new EventEmitter<string>();
  @Output() searchFilterChange = new EventEmitter<string>();
  @Output() refresh = new EventEmitter<void>();

    // These methods are already defined, so we do not need to add them again.
    // Keeping them here for reference.
    onStatusFilterChange(event: Event) {
      const value = (event.target as HTMLSelectElement)?.value || '';
      this.statusFilterChange.emit(value);
    }
    onPeriodFilterChange(event: Event) {
      const value = (event.target as HTMLSelectElement)?.value || '';
      this.periodFilterChange.emit(value);
    }
    onTypeFilterChange(event: Event) {
      const value = (event.target as HTMLSelectElement)?.value || '';
      this.typeFilterChange.emit(value);
    }
}
