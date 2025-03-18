import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './footer/footer.component';
import { MobnavComponent } from './mobnav/mobnav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MobnavComponent,
  ],
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
