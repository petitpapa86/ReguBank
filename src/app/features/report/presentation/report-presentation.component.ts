import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-presentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-presentation.component.html',
  styleUrls: ['../report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportPresentationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Input() showModal!: boolean;
  @Input() modalType!: string;
  @Input() notification!: { message: string; type: string } | null;
  @Input() reports: any[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  @Output() back = new EventEmitter<void>();
  @Output() changePage = new EventEmitter<number>();
  @Output() downloadReport = new EventEmitter<void>();
  @Output() emailReport = new EventEmitter<void>();
  @Output() scheduleSubmission = new EventEmitter<void>();
  @Output() archiveReport = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() sendEmail = new EventEmitter<void>();
  @Output() scheduleReport = new EventEmitter<void>();
}
