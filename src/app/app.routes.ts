

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardContainerComponent } from './features/dashboard/container/dashboard-container.component';
import { ReportContainerComponent } from './features/report/container/report-container.component';

import { RisultatiAnalisiComponent } from './features/dashboard/presentation/risultati-analisi.component';

export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: 'dashboard', component: DashboardContainerComponent },
			{ path: 'report', component: ReportContainerComponent },
			{ path: 'file-processing', loadComponent: () => import('./features/file-processing/file-processing.component').then(m => m.FileProcessingComponent) },
			{ path: 'risultati-analisi', component: RisultatiAnalisiComponent },
			{ path: 'configurazione', loadComponent: () => import('./features/configurazione/container/configurazione-container.component').then(m => m.ConfigurazioneContainerComponent) },
		]
	}
];
