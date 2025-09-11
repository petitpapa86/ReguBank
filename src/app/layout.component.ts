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
      <nav class="bg-white shadow-sm border-b sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <span class="font-bold text-xl text-red-700">ComplianceCore</span>
            <a routerLink="/data-sources" 
               class="text-gray-700 font-medium hover:text-red-600 transition-colors"
               routerLinkActive="text-red-600 font-semibold">
              Data Sources
            </a>
            <a routerLink="/rules" 
               class="text-gray-700 font-medium hover:text-red-600 transition-colors"
               routerLinkActive="text-red-600 font-semibold">
              Rules
            </a>
            <a routerLink="/templates" 
               class="text-gray-700 font-medium hover:text-red-600 transition-colors"
               routerLinkActive="text-red-600 font-semibold">
              Templates
            </a>
            <a routerLink="/reports" 
               class="text-gray-700 font-medium hover:text-red-600 transition-colors"
               routerLinkActive="text-red-600 font-semibold">
              Reports
            </a>
            <a routerLink="/settings" 
               class="text-gray-700 font-medium hover:text-red-600 transition-colors"
               routerLinkActive="text-red-600 font-semibold">
              Settings
            </a>
          </div>
          <div class="flex items-center gap-4">
            <input type="text" 
                   placeholder="Search" 
                   class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-red-500 focus:border-red-500" />
            <div class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700">
              P
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