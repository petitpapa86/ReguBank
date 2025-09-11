You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.
## TypeScript Best Practices
- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain
## Angular Best Practices
- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.
## Components
- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- DO NOT use `ngStyle`, use `style` bindings instead
## State Management
- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead
## Templates
- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
## Services
- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

# Development Guidelines - Adding New Requirements

## 📋 **Overview**

This guide provides step-by-step instructions for adding new features to the ComplianceCore application while maintaining architectural consistency, code quality, and design standards.

## 🏗️ **Architecture Patterns**

### Core Architecture
Our application follows these patterns:
- **Functional Reactive Programming** with Angular Signals
- **Clean Architecture** with Use Cases and Facades
- **Container/Presentation** component pattern
- **Consistent Layout** system

### File Structure
```
src/app/
├── core/
│   ├── facades/           # State management
│   ├── functions/         # Pure functions (API, IO, System)
│   ├── use-cases/         # Business logic
│   └── models/           # TypeScript interfaces
├── features/
│   └── [feature-name]/
│       ├── overview/     # List/overview pages
│       ├── add/          # Creation flows
│       ├── edit/         # Editing flows
│       └── details/      # Detail views
├── shared/
│   └── components/       # Reusable UI components
└── layout.component.ts   # Main layout wrapper
```

## 🚀 **Step-by-Step Process**

### Step 1: Define Requirements & Models

#### 1.1 Create Data Models
```typescript
// src/app/core/models/[feature].model.ts
export interface YourEntity {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateYourEntityRequest {
  name: string;
  // ... other required fields
}

export interface UpdateYourEntityRequest {
  id: string;
  name?: string;
  // ... other optional fields
}
```

#### 1.2 Update Backend Data (db.json)
```json
{
  "yourEntities": [
    {
      "id": "1",
      "name": "Example Entity",
      "status": "active",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ]
}
```

### Step 2: Create API Functions

#### 2.1 Add API Functions
```typescript
// src/app/core/functions/api.functions.ts
export const apiFunctions = {
  // ... existing functions
  
  // Add new entity functions
  loadYourEntities: () => ioFunctions.httpGet('http://localhost:3000/yourEntities'),
  createYourEntity: (entity: CreateYourEntityRequest) => 
    ioFunctions.httpPost('http://localhost:3000/yourEntities', entity),
  updateYourEntity: (id: string, entity: UpdateYourEntityRequest) => 
    ioFunctions.httpPut(`http://localhost:3000/yourEntities/${id}`, entity),
  deleteYourEntity: (id: string) => 
    ioFunctions.httpDelete(`http://localhost:3000/yourEntities/${id}`)
};
```

### Step 3: Create Use Cases

#### 3.1 CRUD Use Cases
```typescript
// src/app/core/use-cases/your-entity-crud.usecase.ts
import { YourEntity, CreateYourEntityRequest, UpdateYourEntityRequest } from '../models/your-entity.model';
import { apiFunctions } from '../functions/api.functions';

export function createListYourEntitiesUseCase(): () => Promise<YourEntity[]> {
  return async () => {
    return await apiFunctions.loadYourEntities()();
  };
}

export function createCreateYourEntityUseCase(): (data: CreateYourEntityRequest) => Promise<YourEntity> {
  return async (data: CreateYourEntityRequest) => {
    return await apiFunctions.createYourEntity(data)();
  };
}

export function createUpdateYourEntityUseCase(): (id: string, data: UpdateYourEntityRequest) => Promise<YourEntity> {
  return async (id: string, data: UpdateYourEntityRequest) => {
    return await apiFunctions.updateYourEntity(id, data)();
  };
}

export function createDeleteYourEntityUseCase(): (id: string) => Promise<void> {
  return async (id: string) => {
    await apiFunctions.deleteYourEntity(id)();
  };
}
```

### Step 4: Create Facade

#### 4.1 State Management Facade
```typescript
// src/app/core/facades/your-entity.facade.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { YourEntity, CreateYourEntityRequest, UpdateYourEntityRequest } from '../models/your-entity.model';
import {
  createListYourEntitiesUseCase,
  createCreateYourEntityUseCase,
  createUpdateYourEntityUseCase,
  createDeleteYourEntityUseCase
} from '../use-cases/your-entity-crud.usecase';

@Injectable({ providedIn: 'root' })
export class YourEntityFacade {
  private readonly listUseCase = createListYourEntitiesUseCase();
  private readonly createUseCase = createCreateYourEntityUseCase();
  private readonly updateUseCase = createUpdateYourEntityUseCase();
  private readonly deleteUseCase = createDeleteYourEntityUseCase();
  
  private readonly _dataVersion = signal(0);
  private readonly _cachedEntities = signal<YourEntity[]>([]);
  private readonly _cachedError = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly lastError = signal<string | null>(null);

  // Computed properties
  readonly entities = computed(() => {
    this._dataVersion();
    return this._cachedEntities();
  });

  readonly activeEntities = computed(() => 
    this.entities().filter(entity => entity.status === 'active').length
  );

  readonly totalEntities = computed(() => this.entities().length);

  // Effect handles async operations
  private _loadEffect = effect(async () => {
    const version = this._dataVersion();
    if (version > 0) {
      await this._performLoad();
    }
  });

  private _errorEffect = effect(() => {
    const error = this._cachedError();
    this.lastError.set(error);
  });

  constructor() {
    this.loadEntities();
  }

  private async _performLoad() {
    this.isLoading.set(true);
    try {
      const result = await this.listUseCase();
      this._cachedEntities.set(result);
      this._cachedError.set(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load entities';
      this._cachedError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }

  // Public methods
  loadEntities() {
    this._dataVersion.update(v => v + 1);
  }

  async createEntity(entity: CreateYourEntityRequest) {
    this.isLoading.set(true);
    this._cachedError.set(null);
    
    try {
      await this.createUseCase(entity);
      this.loadEntities();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create entity';
      this._cachedError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateEntity(id: string, entity: UpdateYourEntityRequest) {
    this.isLoading.set(true);
    try {
      await this.updateUseCase(id, entity);
      this.loadEntities();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update entity';
      this._cachedError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteEntity(id: string) {
    this.isLoading.set(true);
    try {
      await this.deleteUseCase(id);
      this.loadEntities();
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete entity';
      this._cachedError.set(message);
      return { success: false, error: message };
    } finally {
      this.isLoading.set(false);
    }
  }

  clearError() {
    this._cachedError.set(null);
    this.lastError.set(null);
  }
}
```

### Step 5: Create Components

#### 5.1 Overview Container Component
```typescript
// src/app/features/your-feature/overview/your-feature-overview-container.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { YourFeatureOverviewPresentationComponent } from './your-feature-overview-presentation.component';
import { YourEntityFacade } from '../../../core/facades/your-entity.facade';

@Component({
  selector: 'app-your-feature-overview-container',
  standalone: true,
  imports: [CommonModule, YourFeatureOverviewPresentationComponent],
  template: `
    <app-your-feature-overview-presentation
      [entities]="facade.entities()"
      [activeEntities]="facade.activeEntities()"
      [totalEntities]="facade.totalEntities()"
      [isLoading]="facade.isLoading()"
      [error]="facade.lastError()"
      (addEntity)="onAddEntity()"
      (deleteEntity)="onDeleteEntity($event)"
      (errorDismiss)="onErrorDismiss()"
    ></app-your-feature-overview-presentation>
  `
})
export class YourFeatureOverviewContainerComponent {
  facade = inject(YourEntityFacade);
  router = inject(Router);

  onAddEntity() {
    this.router.navigate(['/your-feature/add']);
  }

  async onDeleteEntity(id: string) {
    if (confirm('Are you sure you want to delete this item?')) {
      await this.facade.deleteEntity(id);
    }
  }

  onErrorDismiss() {
    this.facade.clearError();
  }
}
```

#### 5.2 Overview Presentation Component
```typescript
// src/app/features/your-feature/overview/your-feature-overview-presentation.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ErrorBannerComponent } from '../../../shared/components/error-banner.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-your-feature-overview-presentation',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ErrorBannerComponent],
  template: `
    <!-- CONSISTENT LAYOUT PATTERN -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Breadcrumb -->
      <nav class="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol class="list-none p-0 inline-flex">
          <li class="flex items-center">
            <span class="font-semibold text-gray-700">Your Feature</span>
          </li>
        </ol>
      </nav>

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div class="mb-4 sm:mb-0">
          <h1 class="text-3xl font-bold text-gray-900">Your Feature Overview</h1>
          <p class="text-gray-600 mt-2">Manage and monitor your feature entities.</p>
        </div>
        <button class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-semibold transition-colors" 
                (click)="addEntity.emit()">
          + Add New Item
        </button>
      </div>

      <!-- Error Handling -->
      <app-error-banner 
        [error]="error" 
        [dismissible]="true"
        (dismiss)="errorDismiss.emit()">
      </app-error-banner>

      <!-- Loading State -->
      <app-loading-spinner 
        [isLoading]="isLoading" 
        message="Loading entities...">
      </app-loading-spinner>

      <!-- Content -->
      @if (!isLoading) {
        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-green-600">{{activeEntities}}</div>
            <div class="text-sm text-gray-500 mt-2">Active Items</div>
          </div>
          <div class="bg-white rounded-lg shadow-sm p-6 text-center">
            <div class="text-3xl font-bold text-gray-800">{{totalEntities}}</div>
            <div class="text-sm text-gray-500 mt-2">Total Items</div>
          </div>
          <!-- Add more stats as needed -->
        </div>

        <!-- Main Content Table/Grid -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (entity of entities; track entity.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{entity.name}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    @if (entity.status === 'active') {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    }
                    @if (entity.status === 'inactive') {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    }
                    @if (entity.status === 'pending') {
                      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    }
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{formatDate(entity.createdAt)}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div class="flex gap-3">
                      <button class="hover:text-blue-600 transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button class="hover:text-red-600 transition-colors" title="Delete" 
                              (click)="deleteEntity.emit(entity.id)">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                    <div class="text-4xl mb-4">📋</div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                    <p class="text-gray-600 mb-6">Get started by adding your first item.</p>
                    <button class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                            (click)="addEntity.emit()">
                      Add New Item
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class YourFeatureOverviewPresentationComponent {
  @Input() entities!: any[];
  @Input() activeEntities!: number;
  @Input() totalEntities!: number;
  @Input() isLoading = false;
  @Input() error: string | null = null;
  
  @Output() addEntity = new EventEmitter<void>();
  @Output() deleteEntity = new EventEmitter<string>();
  @Output() errorDismiss = new EventEmitter<void>();

  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }
}
```

### Step 6: Add Routes

#### 6.1 Update App Routes
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DataSourcesOverviewContainerComponent } from './features/data-sources/overview/data-sources-overview-container.component';
import { AddDataSourceContainerComponent } from './features/data-sources/add/add-data-source-container.component';
// ADD NEW IMPORTS
import { YourFeatureOverviewContainerComponent } from './features/your-feature/overview/your-feature-overview-container.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'data-sources', pathMatch: 'full' },
      { path: 'data-sources', component: DataSourcesOverviewContainerComponent },
      { path: 'data-sources/add', component: AddDataSourceContainerComponent },
      
      // ADD NEW ROUTES
      { path: 'your-feature', component: YourFeatureOverviewContainerComponent },
      // { path: 'your-feature/add', component: YourFeatureAddContainerComponent },
      // { path: 'your-feature/:id/edit', component: YourFeatureEditContainerComponent },
    ]
  }
];
```

#### 6.2 Update Navigation
```typescript
// src/app/layout.component.ts - Add navigation link
<a routerLink="/your-feature" 
   class="text-gray-700 font-medium hover:text-red-600 transition-colors"
   routerLinkActive="text-red-600 font-semibold">
  Your Feature
</a>
```

## 🎨 **Design Standards**

### Layout Consistency
```typescript
// ALWAYS use this container pattern:
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <!-- Breadcrumb -->
  <!-- Page Header -->
  <!-- Error Handling -->
  <!-- Loading State -->
  <!-- Content -->
</div>
```

### Component Naming
- **Container**: `[feature-name]-[page-type]-container.component.ts`
- **Presentation**: `[feature-name]-[page-type]-presentation.component.ts`
- **Facade**: `[feature-name].facade.ts`
- **Model**: `[feature-name].model.ts`

### Color Scheme
- **Primary Red**: `bg-red-600 hover:bg-red-700`
- **Success Green**: `bg-green-100 text-green-800`
- **Warning Yellow**: `bg-yellow-100 text-yellow-800`
- **Error Red**: `bg-red-100 text-red-800`
- **Neutral Gray**: `bg-gray-100 text-gray-800`

## ✅ **Checklist for New Features**

### Before Starting
- [ ] Requirements clearly defined
- [ ] Data models designed
- [ ] API endpoints planned
- [ ] UI mockups/wireframes ready

### Implementation
- [ ] Models created with proper TypeScript interfaces
- [ ] API functions implemented
- [ ] Use cases created following functional pattern
- [ ] Facade implemented with signals and computed values
- [ ] Container component created
- [ ] Presentation component created with proper responsive design
- [ ] Routes added to app.routes.ts
- [ ] Navigation updated in layout.component.ts

### Testing & Quality
- [ ] All components follow consistent naming conventions
- [ ] Error handling implemented throughout
- [ ] Loading states implemented
- [ ] Responsive design tested
- [ ] Accessibility considerations met
- [ ] TypeScript strict mode compliance

### Documentation
- [ ] API endpoints documented
- [ ] Component interfaces documented
- [ ] Any business logic explained

## 🔧 **Common Patterns**

### Error Handling Pattern
```typescript
try {
  const result = await this.useCase(data);
  this._cachedData.set(result);
  this._cachedError.set(null);
  return { success: true };
} catch (error) {
  const message = error instanceof Error ? error.message : 'Operation failed';
  this._cachedError.set(message);
  return { success: false, error: message };
} finally {
  this.isLoading.set(false);
}
```

### Loading State Pattern
```typescript
// In facade
readonly isLoading = signal(false);

// In template
<app-loading-spinner 
  [isLoading]="facade.isLoading()" 
  message="Loading...">
</app-loading-spinner>
```

### Responsive Grid Pattern
```typescript
<!-- Stats/Cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

<!-- Form Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

<!-- Action Buttons -->
<div class="flex flex-col sm:flex-row gap-4">
```

## 🚫 **What NOT to Do**

### Avoid These Patterns
- ❌ Direct HTTP calls in components
- ❌ Business logic in presentation components
- ❌ Hardcoded data or configuration
- ❌ Using `any` type in TypeScript
- ❌ Missing error handling
- ❌ Inconsistent naming conventions
- ❌ Mixing container and presentation concerns
- ❌ Creating components without proper responsive design
- ❌ Using outdated Angular patterns (NgModules, etc.)

### Anti-Patterns
```typescript
// ❌ DON'T DO THIS
export class BadComponent {
  constructor(private http: HttpClient) {}
  
  async loadData() {
    const data = await this.http.get<any>('/api/data').toPromise();
    // Direct HTTP + any type + no error handling
  }
}

// ✅ DO THIS INSTEAD
export class GoodComponent {
  facade = inject(YourEntityFacade);
  
  ngOnInit() {
    this.facade.loadEntities(); // Facade handles everything
  }
}
```

## 📚 **Additional Resources**

### Reference Files
- Look at existing `data-sources` implementation as reference
- Follow patterns in `DataSourcesFacade` for state management
- Use `ErrorBannerComponent` and `LoadingSpinnerComponent` consistently

### Key Files to Study
- `src/app/core/facades/data-sources.facade.ts`
- `src/app/features/data-sources/overview/`
- `src/app/shared/components/`

This guide ensures consistency across the application and helps maintain high code quality while scaling the project.