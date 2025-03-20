import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, publicGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', canActivate: [publicGuard], component: LoginComponent },
  { path: 'home', canActivate: [authGuard], component: HomeComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'ajustes', component: SettingsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
