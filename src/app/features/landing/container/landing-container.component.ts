import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LandingPresentationComponent } from '../presentation/landing-presentation.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-container',
  standalone: true,
  imports: [CommonModule, LandingPresentationComponent],
  template: `
    <app-landing-presentation
      (startRegistration)="onStartRegistration()"
      (learnMore)="onLearnMore()"
      (contactUs)="onContactUs()"
    />
  `
})
export class LandingContainerComponent {
  private router = inject(Router);

  onStartRegistration() {
    this.router.navigate(['/register']);
  }

  onLearnMore() {
    const el = document.getElementById('come-funziona');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  onContactUs() {
    window.location.href = 'mailto:hello@compliancecore.io?subject=Richiesta Informazioni BCBS 239';
  }
}
