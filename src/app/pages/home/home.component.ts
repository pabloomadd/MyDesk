import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { INote } from '../../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
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

  // Campos Nota
  noteTitle: string = ''
  noteDescrip: string = '';

  noteForm!: FormGroup;


  notesList: INote[] = [];

  private intervalId?: ReturnType<typeof setInterval>;

  private _apiFirestore = inject(FirestoreService)

  constructor(private formBuilder: FormBuilder) {
    this.noteForm = this.formBuilder.group({
      title: ['', Validators.required],
      descrip: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      const fecha = this.getTimeInTimeZone('America/Santiago');
      this.updateTime(fecha);
    }, 1000);

    this._apiFirestore.getNotes().subscribe({
      next: (notes) => {
        this.notesList = notes;
      },
      error: (error) => {
        console.error('Error al obtener las notas: ', error);
      }
    });

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


  newNote(event: Event) {
    event.preventDefault();
    this._apiFirestore.newNote(this.noteForm.controls['title'].value,
      this.noteForm.controls['descrip'].value
    )

  }

  editNote(id: string) {

  }

  deleteNote(id: string){

  }
}

