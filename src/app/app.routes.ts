

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardContainerComponent } from './features/dashboard/container/dashboard-container.component';
import { ReportContainerComponent } from './features/report/container/report-container.component';

import { RisultatiAnalisiComponent } from './features/dashboard/presentation/risultati-analisi.component';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./features/landing/container/landing-container.component').then(m => m.LandingContainerComponent)
	},
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: 'dashboard', component: DashboardContainerComponent },
			{ path: 'report', component: ReportContainerComponent },
			{ path: 'file-processing', loadComponent: () => import('./features/file-management/overview/file-management-overview-container.component').then(m => m.FileManagementOverviewContainerComponent) },
			{ path: 'risultati-analisi', component: RisultatiAnalisiComponent },
			{ path: 'configurazione', loadComponent: () => import('./features/configurazione/container/configurazione-container.component').then(m => m.ConfigurazioneContainerComponent) },
		]
	}
];
