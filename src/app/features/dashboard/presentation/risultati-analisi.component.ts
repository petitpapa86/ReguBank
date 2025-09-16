import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RisultatiAnalisiFacade } from '../../../core/facades/risultati-analisi.facade';

@Component({
  selector: 'app-risultati-analisi',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risultati-analisi.component.html',
  styleUrls: ['./risultati-analisi.component.css']
})
export class RisultatiAnalisiComponent {
  facade = inject(RisultatiAnalisiFacade);
  router = inject(Router);

  get data() {
    return this.facade.data();
  }
  get isLoading() {
    return this.facade.isLoading();
  }
  get error() {
    return this.facade.lastError();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  generateReport() {
    this.showNotification('Generazione report PDF avviata...', 'info');
    setTimeout(() => {
      this.showNotification('Report completato! Reindirizzamento...', 'success');
      setTimeout(() => {
        this.router.navigate(['/report']);
      }, 1000);
    }, 2000);
  }

  showNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
    alert(message);
  }
}
