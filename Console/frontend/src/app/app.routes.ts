import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { RoutingPropsComponent } from './pages/settings-routing-properties/settings-routing-prop.component';
import { AppPropsComponent } from './pages/app-properties/app-properties.component';
import { RoutesComponent } from './pages/app-routes/app-routes.component';
import { AlertsComponent } from './pages/alerts/alerts.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { NotFoundComponent } from './pages/404/not-found.component';
import { PerformanceComponent } from './pages/performance/performance.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'alerts',
    component: AlertsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'performances',
    component: PerformanceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/routing-properties',
    component: RoutingPropsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/application-properties',
    component: AppPropsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/routes',
    component: RoutesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/preferences',
    component: PreferencesComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];
