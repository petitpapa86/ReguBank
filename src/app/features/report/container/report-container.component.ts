import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPresentationComponent } from '../presentation/report-presentation.component';
import { ReportFacade } from '../../../core/facades/report.facade';

@Component({
  selector: 'app-report-container',
  standalone: true,
  imports: [CommonModule, ReportPresentationComponent],
  template: `
    <app-report-presentation
      [currentPage]="currentPage()"
      [totalPages]="totalPages"
      [showModal]="showModal()"
      [modalType]="modalType()"
      [notification]="notification()"
      [reports]="facade.reports()"
      [loading]="facade.loading()"
      [error]="facade.error()"
      (back)="onBack()"
      (changePage)="onChangePage($event)"
      (downloadReport)="onDownloadReport()"
      (emailReport)="onEmailReport()"
      (scheduleSubmission)="onScheduleSubmission()"
      (archiveReport)="onArchiveReport()"
      (closeModal)="onCloseModal()"
      (sendEmail)="onSendEmail()"
      (scheduleReport)="onScheduleReport()"
    />
  `,
  styleUrls: ['../report.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportContainerComponent {
  totalPages = 15;
  currentPage = signal(1);
  showModal = signal(false);
  modalType = signal('');
  notification = signal<{ message: string; type: string } | null>(null);

  facade = inject(ReportFacade);

  onBack() {
    window.history.back();
  }
  onChangePage(page: number) {
    this.currentPage.set(Number(page));
  }
  onDownloadReport() {
    this.notification.set({ message: 'Download del report avviato...', type: 'info' });
    setTimeout(() => {
      this.notification.set({ message: 'Report scaricato con successo!', type: 'success' });
    }, 1000);
  }
  onEmailReport() {
    this.showModal.set(true);
    this.modalType.set('email');
  }
  onScheduleSubmission() {
    this.showModal.set(true);
    this.modalType.set('schedule');
  }
  onArchiveReport() {
    this.notification.set({ message: 'Report archiviato con successo', type: 'success' });
  }
  onCloseModal() {
    this.showModal.set(false);
    this.modalType.set('');
  }
  onSendEmail() {
    this.showModal.set(false);
    this.notification.set({ message: 'Report inviato con successo a compliance@bancaitaliana.it', type: 'success' });
  }
  onScheduleReport() {
    this.showModal.set(false);
    this.notification.set({ message: 'Invio automatico programmato per il 31 Ottobre 2025', type: 'success' });
  }
}
