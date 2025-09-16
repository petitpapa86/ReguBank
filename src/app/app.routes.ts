

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashboardContainerComponent } from './features/dashboard/container/dashboard-container.component';

export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: 'dashboard', component: DashboardContainerComponent },
		]
	}
];
