

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configurazione',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurazione.component.html',
  styleUrls: ['./configurazione.component.css']
})
export class ConfigurazioneComponent {
  denominazione = 'Banca Italiana S.p.A.';
  abi = '05584';
  lei = 'IT123456789012345678';
  valuta = 'EUR - Euro';

  limiteGrandiEsposizioni = 25;
  sogliaGrandeEsposizione = 10;
  capitaleAmmissibile = '2.500.000.000';
  sogliaQualitaDati = 95;

  templateReport = "Banca d'Italia Standard";
  linguaReport = 'Italiano';
  frequenzaGenerazione = 'Mensile';
  emailNotifiche = 'compliance@bancaitaliana.it';

  invioAutomatico = true;
  notificaViolazioni = true;
  archiviazioneAutomatica = false;

  notification: string | null = null;
  notificationType: 'success' | 'error' | 'info' = 'info';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  saveSettings() {
    this.showNotification('Configurazione salvata con successo!', 'success');
  }

  resetSettings() {
    if (confirm('Sei sicuro di voler ripristinare le impostazioni predefinite?')) {
      this.denominazione = 'Banca Italiana S.p.A.';
      this.abi = '05584';
      this.lei = 'IT123456789012345678';
      this.valuta = 'EUR - Euro';
      this.limiteGrandiEsposizioni = 25;
      this.sogliaGrandeEsposizione = 10;
      this.capitaleAmmissibile = '2.500.000.000';
      this.sogliaQualitaDati = 95;
      this.templateReport = "Banca d'Italia Standard";
      this.linguaReport = 'Italiano';
      this.frequenzaGenerazione = 'Mensile';
      this.emailNotifiche = 'compliance@bancaitaliana.it';
      this.invioAutomatico = true;
      this.notificaViolazioni = true;
      this.archiviazioneAutomatica = false;
      this.showNotification('Impostazioni ripristinate ai valori default', 'info');
    }
  }

  showNotification(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notification = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notification = null;
    }, 5000);
  }
}
