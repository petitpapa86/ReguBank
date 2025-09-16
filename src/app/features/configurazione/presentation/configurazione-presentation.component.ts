
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurazioneBCBS239 } from '../../../core/models/dashboard.model';
import { Utente } from '../../../core/models/utente.model';

@Component({
  selector: 'app-configurazione-presentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurazione-presentation.component.html',
  styleUrls: ['./configurazione-presentation.component.css']
})

export class ConfigurazionePresentationComponent {
  @Input() model!: {
    denominazione: string;
    abi: string;
    lei: string;
    valuta: string;
    bcbs239: ConfigurazioneBCBS239;
    // ...other config fields
  };
  @Input() utenti: Utente[] = [];
  @Input() notification: string | null = null;
  @Input() notificationType: 'success' | 'error' | 'info' = 'info';
  @Output() save = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  @Output() notificationDismiss = new EventEmitter<void>();
  activeTab: 'bank' | 'bcbs' | 'reports' | 'users' = 'bank';
  showAddUserModal = false;

  newUser: Partial<Utente> = {
    nome: '',
    email: '',
    ruolo: 'Analyst',
    funzione: '',
    stato: 'Attivo',
    ultimoAccesso: new Date().toISOString()
  };

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  hideAddUserModal() {
    this.showAddUserModal = false;
    this.newUser = {
      nome: '',
      email: '',
      ruolo: 'Analyst',
      funzione: '',
      stato: 'Attivo',
      ultimoAccesso: new Date().toISOString()
    };
  }

  addNewUser() {
    // Emit event or call facade to add user (to be implemented)
    // For now, just close modal
    this.hideAddUserModal();
  }

  getInitials(utente: Utente): string {
    if (!utente || !utente.nome) return '';
    return utente.nome.split(' ').map(n => n[0]).join('').toUpperCase();
  }
}
