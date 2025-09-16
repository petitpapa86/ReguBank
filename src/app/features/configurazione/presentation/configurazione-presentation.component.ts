import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configurazione-presentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurazione-presentation.component.html',
  styleUrls: ['./configurazione-presentation.component.css']
})
export class ConfigurazionePresentationComponent {
  @Input() model: any;
  @Input() notification: string | null = null;
  @Input() notificationType: 'success' | 'error' | 'info' = 'info';
  @Output() save = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() goBack = new EventEmitter<void>();
  @Output() notificationDismiss = new EventEmitter<void>();
}
