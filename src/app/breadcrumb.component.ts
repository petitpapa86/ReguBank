import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
      <ol class="list-none p-0 inline-flex">
        <li *ngFor="let crumb of breadcrumbs; let last = last" class="flex items-center">
          <a *ngIf="!last" [routerLink]="crumb.url" class="hover:text-red-600">{{ crumb.label }}</a>
          <span *ngIf="last" class="font-semibold text-gray-700">{{ crumb.label }}</span>
          <span *ngIf="!last" class="mx-2">/</span>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.breadcrumbs = this.buildBreadcrumbs(this.router.url);
    });
    this.breadcrumbs = this.buildBreadcrumbs(this.router.url);
  }

  buildBreadcrumbs(url: string): Array<{ label: string, url: string }> {
    const segments = url.split('/').filter(Boolean);
    const crumbs = [];
    let path = '';
    for (const segment of segments) {
      path += '/' + segment;
      crumbs.push({ label: this.formatLabel(segment), url: path });
    }
    if (crumbs.length === 0) {
      crumbs.push({ label: 'Dashboard', url: '/data-sources' });
    }
    return crumbs;
  }

  formatLabel(segment: string): string {
    switch (segment) {
      case 'data-sources': return 'Data Sources';
      case 'add': return 'Add Source';
      case 'dashboard': return 'Dashboard';
      default: return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  }
}
