import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  fecha = new Date();
  annio?: number;

  showNav: boolean = false;

  constructor(private _router: Router, public _auth: AuthService) { }

  ngOnInit(): void {
    this._auth.authState$.subscribe((user) => {
      this.showNav = !!user;
    })

    this.getCurrentYear();
  }

  getCurrentYear() {
    this.annio = this.fecha.getFullYear()
  }
}
