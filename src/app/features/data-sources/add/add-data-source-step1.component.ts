import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddDataSourceStepperComponent } from './add-data-source-stepper.component';

@Component({
  selector: 'app-add-data-source-step1',
  standalone: true,
  imports: [CommonModule, FormsModule, AddDataSourceStepperComponent],
  template: `
    <div class="max-w-2xl mx-auto">
      <app-add-data-source-stepper [step]="1" stepLabel="Database Type"></app-add-data-source-stepper>
      <div class="bg-white rounded-lg shadow-md p-8">
        <form (ngSubmit)="nextStep()">
          <div class="mb-6">
            <div class="font-semibold mb-2">Select Database Type</div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <label class="border rounded-lg px-4 py-3 flex items-center cursor-pointer" [class.border-red-600]="dbType === 'Oracle'">
                <input type="radio" name="dbType" value="Oracle" [(ngModel)]="dbType" class="mr-2" /> Oracle
              </label>
              <label class="border rounded-lg px-4 py-3 flex items-center cursor-pointer" [class.border-red-600]="dbType === 'SQL Server'">
                <input type="radio" name="dbType" value="SQL Server" [(ngModel)]="dbType" class="mr-2" /> SQL Server
              </label>
              <label class="border rounded-lg px-4 py-3 flex items-center cursor-pointer" [class.border-red-600]="dbType === 'PostgreSQL'">
                <input type="radio" name="dbType" value="PostgreSQL" [(ngModel)]="dbType" class="mr-2" /> PostgreSQL
              </label>
              <label class="border rounded-lg px-4 py-3 flex items-center cursor-pointer" [class.border-red-600]="dbType === 'MySQL'">
                <input type="radio" name="dbType" value="MySQL" [(ngModel)]="dbType" class="mr-2" /> MySQL
              </label>
              <label class="border rounded-lg px-4 py-3 flex items-center cursor-pointer" [class.border-red-600]="dbType === 'Other'">
                <input type="radio" name="dbType" value="Other" [(ngModel)]="dbType" class="mr-2" /> Other
              </label>
            </div>
          </div>
          <div class="mb-6">
            <div class="font-semibold mb-2">Connection Details</div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm mb-1">Host</label>
                <input type="text" [(ngModel)]="host" name="host" class="border rounded px-3 py-2 w-full" placeholder="e.g., localhost" />
              </div>
              <div>
                <label class="block text-sm mb-1">Port</label>
                <input type="text" [(ngModel)]="port" name="port" class="border rounded px-3 py-2 w-full" placeholder="e.g., 5432" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm mb-1">Database Name</label>
                <input type="text" [(ngModel)]="database" name="database" class="border rounded px-3 py-2 w-full" placeholder="e.g., mydatabase" />
              </div>
              <div>
                <label class="block text-sm mb-1">Username</label>
                <input type="text" [(ngModel)]="username" name="username" class="border rounded px-3 py-2 w-full" placeholder="myusername" />
              </div>
            </div>
            <div class="mt-4">
              <label class="block text-sm mb-1">Password</label>
              <input type="password" [(ngModel)]="password" name="password" class="border rounded px-3 py-2 w-full" placeholder="••••••••" />
            </div>
          </div>
          <div class="flex gap-4 mt-8">
            <button type="button" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full" [disabled]="isSubmitting" (click)="testConnection.emit(true)">
              Test Connection
            </button>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" [disabled]="!success">
              Next
            </button>
          </div>
        </form>
        <div *ngIf="error" class="text-red-600 text-sm mt-4">{{ error }}</div>
      </div>
    </div>
  `
})
export class AddDataSourceStep1Component {
  @Input() dbType!: string;
  @Input() host!: string;
  @Input() port!: string;
  @Input() database!: string;
  @Input() username!: string;
  @Input() password!: string;
  @Input() isSubmitting!: boolean;
  @Input() success!: boolean;
  @Input() error!: string | null;
  @Output() testConnection = new EventEmitter<boolean>();
  @Output() next = new EventEmitter<any>();

  nextStep() {
    this.next.emit({
      dbType: this.dbType,
      host: this.host,
      port: this.port,
      database: this.database,
      username: this.username,
      password: this.password
    });
  }
}
