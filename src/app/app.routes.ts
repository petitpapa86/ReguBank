

import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DataSourcesOverviewContainerComponent } from './features/data-sources/overview/data-sources-overview-container.component';
import { AddDataSourceContainerComponent } from './features/data-sources/add/add-data-source-container.component';

export const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: '', redirectTo: 'data-sources', pathMatch: 'full' },
			// { path: 'dashboard', component: DashboardComponent },
			{ path: 'data-sources', component: DataSourcesOverviewContainerComponent },
			{ path: 'data-sources/add', component: AddDataSourceContainerComponent },
			{ path: 'add-source', component: AddDataSourceContainerComponent }
		]
	}
];
