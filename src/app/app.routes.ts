import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: 'ajustes', component: SettingsComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
