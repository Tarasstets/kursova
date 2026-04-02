import { Routes } from '@angular/router';
import { TasksComponent } from './pages/tasks/tasks';
import { AnalyticsComponent } from './pages/analytics/analytics';
import { LoginComponent } from './pages/login/login';
import { AdminComponent } from './pages/admin/admin';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { RegisterComponent } from './pages/register/register';
import { SettingsComponent } from './pages/settings/settings';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'home', component: TasksComponent, canActivate: [authGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },

  { path: '**', redirectTo: 'login' }
];