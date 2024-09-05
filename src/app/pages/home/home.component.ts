import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  fecha = new Date();
  hours?: number;
  minutes?: number;
  secs?: number;

  ngOnInit(): void {
  }

  updateTime() {
    // OBTENER TIEMPO ACTUAL Y CALCULAR GRADOS PARA MANECILLAS
    this.secs = this.fecha.getSeconds();
    this.minutes = this.fecha.getMinutes();
    this.hours = this.fecha.getHours();
  }

}
