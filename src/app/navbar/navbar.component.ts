import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Toast } from 'bootstrap';


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
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const userData = JSON.parse(savedData);

      this.avatarImg = userData.avatar;
      this.nombre = userData.name;
      this.vocacion = userData.vocacion;


    } else {
      this._apiAuth.getUserDocument().subscribe(
        (userData) => {

          this.avatarImg = userData.avatar;
          this.nombre = userData.name;
          this.vocacion = userData.vocacion;

          const { userid, ...userDataWithoutId } = userData;
          localStorage.setItem('userData', JSON.stringify(userDataWithoutId));
        },
        (error) => {
          console.error('Error al Obtener Datos: ', error);
        }
      );
    }
  }

  logOut() {
    this.toastOut().then(() => {
      this._apiAuth.logOut();
      localStorage.clear();
      setTimeout(() => {
        this._router.navigate(['login']);
      }, 1500);
    });
  }

  toastOut(): Promise<void> {
    return new Promise((resolve) => {
      const toastEl = document.getElementById('Toast');

      if (toastEl) {
        const toast = new Toast(toastEl, {
          autohide: true,
          delay: 3000
        });
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

}
