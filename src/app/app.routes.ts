import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'ajustes', component: SettingsComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},
    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];
