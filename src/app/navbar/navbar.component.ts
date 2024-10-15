import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private _apiAuth = inject(AuthService)
  private _router = inject(Router)

  nombre?: string;
  vocacion?: string;

  avatarImg?: string;

  ngOnInit() {
    this.getData();
  }

  getData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._apiAuth.getUserDocument().subscribe(
        (userData) => {
          console.log('Datos Obtenidos: ', userData);
          this.avatarImg = userData.avatar;
          this.nombre = userData.name;
          this.vocacion = userData.vocacion

          resolve(); // Datos cargados con éxito
        },
        (error) => {
          console.error('Error al Obtener Datos: ', error);
          reject(error); // Error al cargar los datos
        }
      );
    });
  }

  logOut() {
    this._apiAuth.logOut();
    setTimeout(() => {
      this._router.navigate(['login'])
    }, 1000);
  }

}
