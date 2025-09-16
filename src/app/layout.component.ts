// src/app/layout.component.ts - FIXED VERSION
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="bg-gray-50 min-h-screen flex flex-col">
      <!-- Header -->
  <nav class="shadow-lg sticky top-0 z-40" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <div class="text-white text-xl font-bold">ComplianceCore</div>
          <div class="text-white/80 ml-2 text-sm">| BCBS 239</div>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-white/90 hover:text-white text-sm font-medium">Dashboard</a>
          <a href="#" class="text-white/70 hover:text-white text-sm font-medium">File</a>
          <a [routerLink]="'/report'" class="text-white/70 hover:text-white text-sm font-medium">Report</a>
          <a href="#" class="text-white/70 hover:text-white text-sm font-medium">Configurazione</a>
        </div>
        <div class="flex items-center space-x-4">
          <div class="hidden md:block text-right">
            <div class="text-white/90 text-sm font-medium">Marco Rossi</div>
            <div class="text-white/70 text-xs">Banca Italiana SpA</div>
          </div>
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-white/30 transition-colors cursor-pointer">
            MR
          </div>
          <button class="text-white/70 hover:text-white">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5V3h0v14z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    </nav>
      
      <!-- Main Content - NO EXTRA CONTAINERS -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white border-t py-4 text-center text-gray-400 text-sm">
        © 2024 ComplianceCore. All rights reserved.
      </footer>
    </div>
  `
})
export class LayoutComponent {}