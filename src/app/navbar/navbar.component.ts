import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  private _apiAuth = inject(AuthService)
  private _apiUser = inject(UserService)
  private _router = inject(Router)

  nombre?: string;
  vocacion?: string;

  avatarImg?: string;

  ngOnInit() {
    this.getData();
  }

  getData() {
    this._apiAuth.getUserDocument().subscribe(
      (userData) => {
        console.log('Datos Obtenidos: ', userData);

        this.avatarImg = userData.avatar
        this.nombre = userData.name;
        this.vocacion = userData.vocacion

      },
      (error) => {
        console.error('Error al Obtener Datos: ', error);

        const savedData = localStorage.getItem('userData');
        if (savedData) {
          const userData = JSON.parse(savedData);

          this.avatarImg = userData.avatar
          this.nombre = userData.name;
          this.vocacion = userData.vocacion
        }
      }
    );
  }

  logOut() {
    this._apiAuth.logOut();
    localStorage.clear();
    setTimeout(() => {
      this._router.navigate(['login'])
    }, 1000);
  }

}
