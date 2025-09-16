import { Injectable, signal } from '@angular/core';
import { Utente } from '../models/utente.model';
import { apiFunctions } from '../functions/api.functions';

@Injectable({ providedIn: 'root' })
export class UtentiFacade {
  utenti = signal<Utente[]>([]);
  isLoading = signal(false);
  lastError = signal<string | null>(null);

  async loadUtenti() {
    this.isLoading.set(true);
    this.lastError.set(null);
    try {
      const utenti = await apiFunctions.loadUtenti()();
      this.utenti.set(utenti);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Errore nel caricamento utenti';
      this.lastError.set(message);
      this.utenti.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }
}
