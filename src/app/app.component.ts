import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  fecha = new Date();
  annio?: number;

  constructor(public router: Router){}

  ngOnInit(): void {
    this.getCurrentYear();
  }

  getCurrentYear() {
    this.annio = this.fecha.getFullYear()
  }
}
