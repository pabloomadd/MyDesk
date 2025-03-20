import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { MobnavComponent } from './mobnav/mobnav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, MobnavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  showNav: boolean = false;

  constructor(private _router: Router, public _auth: AuthService) {}

  ngOnInit(): void {
    this._auth.authState$.subscribe((user) => {
      this.showNav = !!user;
    });
  }
}
