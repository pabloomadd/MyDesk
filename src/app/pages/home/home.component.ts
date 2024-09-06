import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('hrHand', { static: false }) hrHand!: ElementRef;
  @ViewChild('minHand', { static: false }) minHand!: ElementRef;
  @ViewChild('secHand', { static: false }) secHand!: ElementRef;

  secToDeg?: number;
  minToDeg?: number;
  hrToDeg?: number;

  private intervalId?: ReturnType<typeof setInterval>;

  constructor() {
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const fecha = this.getTimeInTimeZone('America/Santiago');
      this.updateTime(fecha);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Limpia el intervalo cuando el componente se destruye
    }
  }

  updateTime(date: Date) {

    this.secToDeg = (date.getSeconds() / 60) * 360;
    this.minToDeg = (date.getMinutes() / 60) * 360;
    this.hrToDeg = (date.getHours() / 12) * 360;


    // ROTAR SECUNDERO SEGUN TIEMPO ACTUAL
    this.secHand.nativeElement.style.transform = `rotate(${this.secToDeg}deg)`
    this.minHand.nativeElement.style.transform = `rotate(${this.minToDeg}deg)`
    this.hrHand.nativeElement.style.transform = `rotate(${this.hrToDeg}deg)`

  }

  // OBTENER ZONA HORARIA
  getTimeInTimeZone(timeZone: string): Date {
    const timeString = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(new Date());

    const hour = Number(timeString.find(part => part.type === 'hour')?.value);
    const minute = Number(timeString.find(part => part.type === 'minute')?.value);
    const second = Number(timeString.find(part => part.type === 'second')?.value);

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(second);

    return date;
  }

}
