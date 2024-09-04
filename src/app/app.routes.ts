import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'perfil', component: PerfilComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
