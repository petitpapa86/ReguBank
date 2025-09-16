import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-presentation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-presentation.component.html',
  styleUrls: ['./landing-presentation.component.css']
})
export class LandingPresentationComponent {
  @Output() startRegistration = new EventEmitter<void>();
  @Output() learnMore = new EventEmitter<void>();
  @Output() contactUs = new EventEmitter<void>();
}
