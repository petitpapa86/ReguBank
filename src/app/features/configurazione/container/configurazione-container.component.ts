import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurazionePresentationComponent } from '../presentation/configurazione-presentation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configurazione-container',
  standalone: true,
  imports: [CommonModule, ConfigurazionePresentationComponent],
  template: `
    <app-configurazione-presentation
      [model]="model()"
      [notification]="notification()"
      [notificationType]="notificationType()"
      (save)="onSave()"
      (reset)="onReset()"
      (goBack)="onGoBack()"
      (notificationDismiss)="onNotificationDismiss()"
    />
  `
})
export class ConfigurazioneContainerComponent {
  private router = inject(Router);
  model = signal({
    denominazione: 'Banca Italiana S.p.A.',
    abi: '05584',
    lei: 'IT123456789012345678',
    valuta: 'EUR - Euro',
    limiteGrandiEsposizioni: 25,
    sogliaGrandeEsposizione: 10,
    capitaleAmmissibile: '2.500.000.000',
    sogliaQualitaDati: 95,
    templateReport: "Banca d'Italia Standard",
    linguaReport: 'Italiano',
    frequenzaGenerazione: 'Mensile',
    emailNotifiche: 'compliance@bancaitaliana.it',
    invioAutomatico: true,
    notificaViolazioni: true,
    archiviazioneAutomatica: false
  });
  notification = signal<string | null>(null);
  notificationType = signal<'success' | 'error' | 'info'>('info');

  onGoBack() {
    this.router.navigate(['/dashboard']);
  }

  onSave() {
    this.notification.set('Configurazione salvata con successo!');
    this.notificationType.set('success');
  }

  onReset() {
    if (confirm('Sei sicuro di voler ripristinare le impostazioni predefinite?')) {
      this.model.set({
        denominazione: 'Banca Italiana S.p.A.',
        abi: '05584',
        lei: 'IT123456789012345678',
        valuta: 'EUR - Euro',
        limiteGrandiEsposizioni: 25,
        sogliaGrandeEsposizione: 10,
        capitaleAmmissibile: '2.500.000.000',
        sogliaQualitaDati: 95,
        templateReport: "Banca d'Italia Standard",
        linguaReport: 'Italiano',
        frequenzaGenerazione: 'Mensile',
        emailNotifiche: 'compliance@bancaitaliana.it',
        invioAutomatico: true,
        notificaViolazioni: true,
        archiviazioneAutomatica: false
      });
      this.notification.set('Impostazioni ripristinate ai valori default');
      this.notificationType.set('info');
    }
  }

  onNotificationDismiss() {
    this.notification.set(null);
  }
}
