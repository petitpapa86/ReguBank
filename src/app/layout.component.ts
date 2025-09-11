import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

// src/app/layout.component.ts
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="bg-gray-50 min-h-screen flex flex-col">
      <!-- Header -->
      <nav class="bg-white shadow-sm border-b sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div class="flex items-center gap-4">
            <span class="font-bold text-xl text-red-700">ComplianceCore</span>
            <a routerLink="/data-sources" class="text-gray-700 font-medium hover:text-red-600">Data Sources</a>
            <a routerLink="/rules" class="text-gray-700 font-medium hover:text-red-600">Rules</a>
            <a routerLink="/templates" class="text-gray-700 font-medium hover:text-red-600">Templates</a>
            <a routerLink="/reports" class="text-gray-700 font-medium hover:text-red-600">Reports</a>
            <a routerLink="/settings" class="text-gray-700 font-medium hover:text-red-600">Settings</a>
          </div>
          <div class="flex items-center gap-4">
            <input type="text" placeholder="Search" class="border rounded px-3 py-1 text-sm" />
            <span class="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">P</span>
          </div>
        </div>
      </nav>
      
      <!-- REMOVED: Breadcrumb from here - each page handles its own -->
      
      <!-- Main Content - NO CONTAINER HERE -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <footer class="bg-white border-t py-4 text-center text-gray-400 text-sm mt-8">
        © 2024 ComplianceCore. All rights reserved.
      </footer>
    </div>
  `
})
export class LayoutComponent {}