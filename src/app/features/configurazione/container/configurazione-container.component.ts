import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurazionePresentationComponent } from '../presentation/configurazione-presentation.component';
import { Utente } from '../../../core/models/utente.model';
import { UtentiFacade } from '../../../core/facades/utenti.facade';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configurazione-container',
  standalone: true,
  imports: [CommonModule, ConfigurazionePresentationComponent],
  template: `
    <app-configurazione-presentation
      [model]="model()"
      [utenti]="utenti()"
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
    bcbs239: {
      limiteGrandiEsposizioni: 25,
      sogliaClassificazione: 10,
      capitaleAmmissibile: 2500000000,
      metodoCalcolo: 'Standardizzato',
      sogliaQualitaMinima: 95,
      validazioneFile: 'automatica' as 'automatica'
    },
    templateReport: "Banca d'Italia Standard",
    linguaReport: 'Italiano',
    frequenzaGenerazione: 'Mensile',
    emailNotifiche: 'compliance@bancaitaliana.it',
    invioAutomatico: true,
    notificaViolazioni: true,
    archiviazioneAutomatica: false
  });
  utenti = signal<Utente[]>([]);
  notification = signal<string | null>(null);
  notificationType = signal<'success' | 'error' | 'info'>('info');

  constructor(private utentiFacade: UtentiFacade) {
    this.utentiFacade.loadUtenti();
    this.utenti = this.utentiFacade.utenti;
  }

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
        bcbs239: {
          limiteGrandiEsposizioni: 25,
          sogliaClassificazione: 10,
          capitaleAmmissibile: 2500000000,
          metodoCalcolo: 'Standardizzato',
          sogliaQualitaMinima: 95,
          validazioneFile: 'automatica' as 'automatica'
        },
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
