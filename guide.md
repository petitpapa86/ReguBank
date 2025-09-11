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


example of structure and programming style
// ========================
// REFACTORED: FUNCTIONAL APPROACH - NO DI TOKENS
// ========================

// 1. SIMPLIFIED DEPENDENCIES - PURE FUNCTIONS
// ========================

// src/app/core/functions/io.functions.ts
export const ioFunctions = {
  // HTTP functions
  httpGet: (url: string) => async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  httpPost: (url: string, data: any) => async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  },

  httpPut: (url: string, data: any) => async () => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
};

// src/app/core/functions/system.functions.ts
export const systemFunctions = {
  // Time functions
  nowISO: () => () => new Date().toISOString(),
  
  // ID generation functions
  generateId: () => () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  
  generateTicketNumbers: (quantity: number) => () => {
    const tickets: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const ticketNumber = `T${Date.now()}${String(i).padStart(3, '0')}`;
      tickets.push(ticketNumber);
    }
    return tickets;
  },

  // Validation functions
  validateEmail: (email: string) => () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// src/app/core/functions/api.functions.ts
const BASE_URL = 'http://localhost:3000';

export const apiFunctions = {
  // Event API functions
  loadEvents: () => ioFunctions.httpGet(`${BASE_URL}/events`),
  
  loadEventById: (id: string) => ioFunctions.httpGet(`${BASE_URL}/events/${id}`),
  
  updateEvent: (event: any) => ioFunctions.httpPut(`${BASE_URL}/events/${event.id}`, event),

  // Ticket API functions  
  loadTickets: () => ioFunctions.httpGet(`${BASE_URL}/tickets`),
  
  saveTicket: (ticket: any) => ioFunctions.httpPost(`${BASE_URL}/tickets`, ticket)
};

// ========================
// 2. REFACTORED USE CASES - FUNCTIONS RETURNING FUNCTIONS
// ========================

// src/app/core/use-cases/list-events.usecase.ts
import { Event, ApiResponse } from '../models';
import { apiFunctions } from '../functions/api.functions';
import { withErrorHandling } from '../utils/error-handler.util';

// Use case factory - returns a function
export const createListEventsUseCase = () => {
  return withErrorHandling(
    async (): Promise<Event[]> => {
      const loadEvents = apiFunctions.loadEvents();
      return await loadEvents();
    },
    'Failed to load events'
  );
};

// src/app/core/use-cases/purchase-ticket.usecase.ts
import { PurchaseRequest, Ticket, Event, ApiResponse } from '../models';
import { apiFunctions } from '../functions/api.functions';
import { systemFunctions } from '../functions/system.functions';

// Validation helper
function validatePurchaseRequest(request: PurchaseRequest): ApiResponse<null> | null {
  const validationErrors: Array<{ field: string; reason: string }> = [];
  
  if (!request.customerName?.trim()) {
    validationErrors.push({ field: 'customerName', reason: 'required' });
  }
  
  if (!request.customerEmail?.trim()) {
    validationErrors.push({ field: 'customerEmail', reason: 'required' });
  } else {
    const validateEmail = systemFunctions.validateEmail(request.customerEmail);
    if (!validateEmail()) {
      validationErrors.push({ field: 'customerEmail', reason: 'invalid_format' });
    }
  }
  
  if (!request.quantity || request.quantity < 1) {
    validationErrors.push({ field: 'quantity', reason: 'must_be_positive' });
  }
  
  if (request.quantity > 10) {
    validationErrors.push({ field: 'quantity', reason: 'max_10_tickets' });
  }
  
  if (validationErrors.length > 0) {
    return {
      success: false,
      type: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: validationErrors
    };
  }
  
  return null;
}

// Business logic helper
async function executePurchase(request: PurchaseRequest): Promise<Ticket> {
  // Load event
  const loadEventById = apiFunctions.loadEventById(request.eventId);
  const event = await loadEventById();
  
  if (!event) {
    throw new Error('Event not found');
  }

  if (event.status !== 'active') {
    throw new Error('Event is not available for purchase');
  }

  if (event.availableTickets < request.quantity) {
    throw new Error(`Only ${event.availableTickets} tickets available`);
  }

  // Create ticket
  const generateId = systemFunctions.generateId();
  const generateTicketNumbers = systemFunctions.generateTicketNumbers(request.quantity);
  const nowISO = systemFunctions.nowISO();
  
  const now = nowISO();
  const ticket: Ticket = {
    id: generateId(),
    eventId: request.eventId,
    customerName: request.customerName.trim(),
    customerEmail: request.customerEmail.trim().toLowerCase(),
    quantity: request.quantity,
    totalPrice: event.price * request.quantity,
    purchaseDate: now,
    status: 'confirmed',
    ticketNumbers: generateTicketNumbers(),
    createdAt: now,
    updatedAt: now
  };

  // Update event availability
  const updatedEvent: Event = {
    ...event,
    availableTickets: event.availableTickets - request.quantity,
    status: event.availableTickets - request.quantity === 0 ? 'sold-out' : event.status,
    updatedAt: now
  };

  // Save both ticket and updated event
  const saveTicket = apiFunctions.saveTicket(ticket);
  const updateEvent = apiFunctions.updateEvent(updatedEvent);
  
  await saveTicket();
  await updateEvent();

  return ticket;
}

// Use case factory - returns a function
export const createPurchaseTicketUseCase = () => {
  return async (request: PurchaseRequest): Promise<ApiResponse<Ticket>> => {
    // Validation phase
    const validationError = validatePurchaseRequest(request);
    if (validationError) {
      return validationError;
    }

    // Business logic phase with error handling
    try {
      const ticket = await executePurchase(request);
      return {
        success: true,
        message: 'Ticket purchased successfully',
        data: ticket
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to purchase ticket';
      
      // Determine error type based on message
      if (errorMessage.includes('not found') || errorMessage.includes('not available') || errorMessage.includes('tickets available')) {
        return {
          success: false,
          type: 'BUSINESS_ERROR',
          message: errorMessage
        };
      }
      
      return {
        success: false,
        type: 'SYSTEM_ERROR',
        message: 'Failed to purchase ticket'
      };
    }
  };
};

// src/app/core/use-cases/list-tickets.usecase.ts
import { Ticket } from '../models';
import { apiFunctions } from '../functions/api.functions';
import { withErrorHandling } from '../utils/error-handler.util';

// Use case factory - returns a function
export const createListTicketsUseCase = () => {
  return withErrorHandling(
    async (): Promise<Ticket[]> => {
      const loadTickets = apiFunctions.loadTickets();
      return await loadTickets();
    },
    'Failed to load tickets'
  );
};

// ========================
// 3. SIMPLIFIED FACADES - NO DI TOKENS
// ========================

// src/app/core/facades/events.facade.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { Event } from '../models';
import { createListEventsUseCase } from '../use-cases/list-events.usecase';

@Injectable({ providedIn: 'root' })
export class EventsFacade {
  // Data version trigger for reactive updates
  private readonly _dataVersion = signal(0);
  
  // State managers
  readonly categoryFilter = signal<'all' | 'music' | 'theater' | 'sports' | 'other'>('all');
  readonly statusFilter = signal<'all' | 'active' | 'sold-out' | 'inactive'>('all');
  readonly lastError = signal<string | null>(null);
  readonly isLoading = signal(false);

  // Use case function - created once
  private readonly listEventsUseCase = createListEventsUseCase();

  // Private cached data
  private readonly _cachedEvents = signal<Event[]>([]);
  private readonly _cachedError = signal<string | null>(null);

  // PURE computed - no side effects
  readonly events = computed(() => {
    this._dataVersion(); // Subscribe to changes
    return this._cachedEvents();
  });

  // Effect handles async operations
  private _loadEventsEffect = effect(async () => {
    const version = this._dataVersion();
    if (version > 0) {
      this.isLoading.set(true);
      const result = await this.listEventsUseCase();
      
      if (result.success) {
        this._cachedEvents.set(result.data);
        this._cachedError.set(null);
      } else {
        this._cachedError.set(result.message);
      }
      this.isLoading.set(false);
    }
  });

  // Effect to update lastError
  private _errorEffect = effect(() => {
    const error = this._cachedError();
    this.lastError.set(error);
  });

  // Derived computed state
  readonly totalEvents = computed(() => this.events().length);
  
  readonly activeEvents = computed(() => 
    this.events().filter(e => e.status === 'active')
  );

  readonly filteredEvents = computed(() => {
    const categoryFilter = this.categoryFilter();
    const statusFilter = this.statusFilter();
    const events = this.events();

    return events.filter(event => {
      const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesCategory && matchesStatus;
    });
  });

  constructor() {
    this.loadEvents();
  }

  // Public operations
  loadEvents() {
    this._dataVersion.update(v => v + 1);
  }

  setCategoryFilter(category: 'all' | 'music' | 'theater' | 'sports' | 'other') {
    this.categoryFilter.set(category);
  }

  setStatusFilter(status: 'all' | 'active' | 'sold-out' | 'inactive') {
    this.statusFilter.set(status);
  }

  clearError() {
    this.lastError.set(null);
  }

  getEventById(id: string): Event | undefined {
    return this.events().find(event => event.id === id);
  }

  // Utility methods
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// src/app/core/facades/tickets.facade.ts
import { Injectable, signal, computed, effect } from '@angular/core';
import { Ticket, PurchaseRequest } from '../models';
import { createListTicketsUseCase } from '../use-cases/list-tickets.usecase';
import { createPurchaseTicketUseCase } from '../use-cases/purchase-ticket.usecase';

@Injectable({ providedIn: 'root' })
export class TicketsFacade {
  // Data version trigger for reactive updates
  private readonly _dataVersion = signal(0);
  
  // State managers
  readonly lastError = signal<string | null>(null);
  readonly isLoading = signal(false);

  // Use case functions - created once
  private readonly listTicketsUseCase = createListTicketsUseCase();
  private readonly purchaseTicketUseCase = createPurchaseTicketUseCase();

  // Private cached data
  private readonly _cachedTickets = signal<Ticket[]>([]);
  private readonly _cachedError = signal<string | null>(null);

  // PURE computed - no side effects
  readonly tickets = computed(() => {
    this._dataVersion(); // Subscribe to changes
    return this._cachedTickets();
  });

  // Effect handles async operations
  private _loadTicketsEffect = effect(async () => {
    const version = this._dataVersion();
    if (version > 0) {
      const result = await this.listTicketsUseCase();
      
      if (result.success) {
        this._cachedTickets.set(result.data);
        this._cachedError.set(null);
      } else {
        this._cachedError.set(result.message);
      }
    }
  });

  // Effect to update lastError
  private _errorEffect = effect(() => {
    const error = this._cachedError();
    this.lastError.set(error);
  });

  // Derived computed state
  readonly totalRevenue = computed(() => {
    return this.tickets().reduce((sum, ticket) => sum + ticket.totalPrice, 0);
  });

  readonly ticketsSoldCount = computed(() => {
    return this.tickets().reduce((sum, ticket) => sum + ticket.quantity, 0);
  });

  constructor() {
    this.loadTickets();
  }

  // Public operations
  loadTickets() {
    this._dataVersion.update(v => v + 1);
  }

  async purchaseTickets(request: PurchaseRequest) {
    this.isLoading.set(true);
    this.lastError.set(null);

    const result = await this.purchaseTicketUseCase(request);
    
    if (!result.success) {
      this.lastError.set(result.message);
    } else {
      // Refresh tickets to get updated data
      this._dataVersion.update(v => v + 1);
    }
    
    this.isLoading.set(false);
    return result;
  }

  clearError() {
    this.lastError.set(null);
  }

  getTicketsForEvent(eventId: string): Ticket[] {
    return this.tickets().filter(ticket => ticket.eventId === eventId);
  }

  getEventTicketCount(eventId: string): number {
    return this.tickets()
      .filter(ticket => ticket.eventId === eventId)
      .reduce((sum, ticket) => sum + ticket.quantity, 0);
  }

  getEventRevenue(eventId: string): number {
    return this.tickets()
      .filter(ticket => ticket.eventId === eventId)
      .reduce((sum, ticket) => sum + ticket.totalPrice, 0);
  }

  // Utility methods
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}

// ========================
// 4. SIMPLIFIED APP CONFIG - NO DI TOKENS
// ========================

// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule)
    // No more dependency injection tokens needed!
  ]
};

// ========================
// 5. UPDATED SMART COMPONENT - SAME AS BEFORE
// ========================

// src/app/features/events/smart/events-smart.component.ts
// (This remains exactly the same - just inject facades directly)
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsFacade } from '../../../core/facades/events.facade';
import { TicketsFacade } from '../../../core/facades/tickets.facade';
import { NotificationService } from '../../../core/services/notification.service';
import { PurchaseRequest } from '../../../core/models';
import { 
  EventCardWithPurchasePresentation,
  PurchaseFormData,
  FilterBarPresentation, 
  FilterState,
  ErrorBannerPresentation,
  LoadingSpinnerPresentation
} from '../../../shared/presentation';

@Component({
  selector: 'app-events-smart',
  standalone: true,
  imports: [
    CommonModule, 
    EventCardWithPurchasePresentation, 
    FilterBarPresentation,
    ErrorBannerPresentation,
    LoadingSpinnerPresentation
  ],
  template: `
    <!-- Same template as Step 2 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header with enhanced stats -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          🎫 Browse & Purchase Events
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Discover amazing events and purchase tickets instantly
        </p>
        
        <!-- Summary Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-primary-600 mb-2">
              {{ eventsFacade.totalEvents() }}
            </div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Total Events
            </div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-green-600 mb-2">
              {{ eventsFacade.activeEvents().length }}
            </div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Available
            </div>
          </div>
          
          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-purple-600 mb-2">
              {{ ticketsFacade.ticketsSoldCount() }}
            </div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Tickets Sold
            </div>
          </div>

          <div class="card p-6 text-center">
            <div class="text-3xl font-bold text-secondary-600 mb-2">
              {{ ticketsFacade.formatPrice(ticketsFacade.totalRevenue()) }}
            </div>
            <div class="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Revenue
            </div>
          </div>
        </div>
      </div>

      <!-- Error Banners -->
      <app-error-banner-presentation
        [error]="eventsFacade.lastError()"
        (dismiss)="eventsFacade.clearError()">
      </app-error-banner-presentation>

      <app-error-banner-presentation
        [error]="ticketsFacade.lastError()"
        (dismiss)="ticketsFacade.clearError()">
      </app-error-banner-presentation>

      <!-- Loading Spinner -->
      <app-loading-spinner-presentation
        [isLoading]="eventsFacade.isLoading() || ticketsFacade.isLoading()"
        message="Loading events..."
        containerClass="py-12">
      </app-loading-spinner-presentation>

      <!-- Filters -->
      <app-filter-bar-presentation
        [filters]="currentFilters()"
        [showResultsCount]="true"
        [resultsCount]="eventsFacade.filteredEvents().length"
        (categoryFilterChange)="onCategoryFilterChange($event)"
        (statusFilterChange)="onStatusFilterChange($event)"
        (refresh)="onRefreshEvents()">
      </app-filter-bar-presentation>

      <!-- Events Grid -->
      @if (!eventsFacade.isLoading()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          @for (event of eventsFacade.filteredEvents(); track event.id) {
            <app-event-card-with-purchase
              [event]="event"
              [formData]="getPurchaseFormData(event.id)"
              [isFormValid]="isPurchaseFormValid(event.id)"
              [isLoading]="isProcessingPurchase()"
              (formChange)="onPurchaseFormChange(event.id, $event)"
              (purchase)="onPurchaseTickets($event)">
            </app-event-card-with-purchase>
          } @empty {
            <div class="col-span-full">
              <div class="text-center py-16">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
                <p class="text-gray-600 mb-6">
                  Try adjusting your filters or check back later for new events.
                </p>
                <button 
                  class="btn-primary"
                  (click)="onRefreshEvents()">
                  Refresh Events
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class EventsSmartComponent {
  // Simple facade injection - no tokens needed!
  eventsFacade = inject(EventsFacade);
  ticketsFacade = inject(TicketsFacade);
  notificationService = inject(NotificationService);
  
  // Same implementation as Step 2...
  private purchaseForms = new Map<string, {
    customerName: ReturnType<typeof signal<string>>;
    customerEmail: ReturnType<typeof signal<string>>;
    quantity: ReturnType<typeof signal<number>>;
  }>();

  private processingPurchase = signal(false);

  currentFilters = computed((): FilterState => ({
    categoryFilter: this.eventsFacade.categoryFilter(),
    statusFilter: this.eventsFacade.statusFilter()
  }));

  // All the same methods as Step 2...
  getPurchaseFormData(eventId: string): PurchaseFormData {
    if (!this.purchaseForms.has(eventId)) {
      this.purchaseForms.set(eventId, {
        customerName: signal(''),
        customerEmail: signal(''),
        quantity: signal(1)
      });
    }
    
    const form = this.purchaseForms.get(eventId)!;
    return {
      customerName: form.customerName(),
      customerEmail: form.customerEmail(),
      quantity: form.quantity()
    };
  }

  onPurchaseFormChange(eventId: string, change: { field: string; value: any }) {
    const form = this.purchaseForms.get(eventId);
    if (!form) return;

    switch (change.field) {
      case 'customerName':
        form.customerName.set(change.value);
        break;
      case 'customerEmail':
        form.customerEmail.set(change.value);
        break;
      case 'quantity':
        form.quantity.set(change.value);
        break;
    }
  }

  isPurchaseFormValid(eventId: string): boolean {
    const formData = this.getPurchaseFormData(eventId);
    const event = this.eventsFacade.events().find(e => e.id === eventId);
    
    if (!event) return false;
    
    return (
      formData.customerName.trim() !== '' &&
      formData.customerEmail.trim() !== '' &&
      formData.customerEmail.includes('@') &&
      formData.quantity > 0 &&
      formData.quantity <= 10 &&
      event.status === 'active' &&
      event.availableTickets >= formData.quantity &&
      !this.processingPurchase()
    );
  }

  isProcessingPurchase(): boolean {
    return this.processingPurchase();
  }

  async onPurchaseTickets(request: PurchaseRequest) {
    this.processingPurchase.set(true);
    
    try {
      const result = await this.ticketsFacade.purchaseTickets(request);
      
      if (result.success) {
        const form = this.purchaseForms.get(request.eventId);
        if (form) {
          form.customerName.set('');
          form.customerEmail.set('');
          form.quantity.set(1);
        }
        
        this.notificationService.showSuccess(
          `🎉 Successfully purchased ${request.quantity} ticket${request.quantity > 1 ? 's' : ''}!`
        );
        
        this.eventsFacade.loadEvents();
      }
    } finally {
      this.processingPurchase.set(false);
    }
  }

  onCategoryFilterChange(category: string) {
    this.eventsFacade.setCategoryFilter(category as any);
  }

  onStatusFilterChange(status: string) {
    this.eventsFacade.setStatusFilter(status as any);
  }

  onRefreshEvents() {
    this.eventsFacade.loadEvents();
    this.ticketsFacade.loadTickets();
  }
}

// ========================
// BENEFITS OF THIS APPROACH
// ========================

/*
✅ NO DEPENDENCY INJECTION TOKENS NEEDED
✅ NO COMPLEX DI CONFIGURATION
✅ PURE FUNCTIONAL COMPOSITION
✅ EASIER TO TEST (just call functions)
✅ SIMPLER ARCHITECTURE
✅ LESS BOILERPLATE CODE
✅ BETTER PERFORMANCE (no DI overhead)
✅ MORE PREDICTABLE (pure functions)
✅ EASIER TO UNDERSTAND
✅ BETTER TREE-SHAKING

COMPARISON:

OLD WAY (with DI tokens):
- Create dependency interfaces
- Create injection tokens  
- Configure providers in app.config
- Inject tokens in constructors
- Complex testing setup with mocked providers

NEW WAY (functional):
- Create pure function factories
- Use case factories return configured functions
- Facades directly use the function factories
- Simple testing - just call functions with test data
- No provider configuration needed

TESTING BECOMES SUPER SIMPLE:
```typescript
// Old way - complex DI mocking
const mockDeps = { LoadEvents: jest.fn(), ... };
TestBed.configureTestingModule({
  providers: [{ provide: EVENT_DEPS, useValue: mockDeps }]
});

// New way - direct function testing
const listEvents = createListEventsUseCase();
const result = await listEvents();
```

This is much cleaner and follows functional programming principles better!
*/