import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {

  fecha = new Date();
  annio?: number;

  ngOnInit() {
    this.getCurrentYear();
  }

  getCurrentYear() {
    this.annio = this.fecha.getFullYear()
  }
}
