import { Component, ElementRef, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { INote } from '../../../models/note.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WeatherService } from '../../services/weather.service';
import { IWeather } from '../../../models/weather.model';
import { AuthService } from '../../services/auth.service';

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

  private intervalReloj?: ReturnType<typeof setInterval>;
  private intervalClima?: ReturnType<typeof setInterval>;
  private _apiWeather = inject(WeatherService);
  private _apiAuth = inject(AuthService);
  private _router = inject(Router);

  //Variables
  secToDeg?: number;
  minToDeg?: number;
  hrToDeg?: number;

  //Datos
  nombre?: string;
  vocacion?: string;

  creating: boolean = true
  noteForm!: FormGroup;

  notesList: INote[] = [];

  weatherDetail!: IWeather;
  kelvinDiff: number = 273.15;
  convC?: number;

  //Cargas
  loadingWeath?: boolean;
  loadingNotes?: boolean;
  loadingClock?: boolean;

  //Configuraciones
  configReloj?: boolean;
  configClima?: boolean;
  configCiudad?: string;
  configPais?: string;

  constructor(private formBuilder: FormBuilder) {
    this.noteForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      descrip: ['', Validators.required],

    })

  }

  //Mejorar Carga de Notas y de Clima
  ngOnInit(): void {
    // Carga de Configuraciones
    this.getData()
      .then(() => {
        // Carga de Clima
        this.loadingWeath = true;
        this.loadingNotes = true;
        this.loadingClock = true;

        // Ejecuta getWeather después de que getData esté listo, usando valores predeterminados si configCiudad o configPais están undefined
        this.getWeather(this.configCiudad || 'defaultCiudad', this.configPais || 'defaultPais');

        // Bucles que verifican si los widgets están activos antes de ejecutar
        if (this.configReloj) {
          this.intervalReloj = setInterval(() => {
            const fecha = this.getTimeInTimeZone('America/Santiago');
            this.updateTime(fecha);
          }, 1000); // Actualización cada 1 segundo
        }

        if (this.configClima) {
          this.intervalClima = setInterval(() => {
            this.getWeather(this.configCiudad || 'defaultCiudad', this.configPais || 'defaultPais');
          }, 600000); // Actualización cada 10 minutos
        }
      })
      .catch((error: any) => {
        console.error('Error al cargar los datos:', error);
      });

    // Obtener las notas
    this._apiAuth.getNotes().subscribe({
      next: (notes) => {
        this.notesList = notes;
        this.loadingNotes = false;
      },
      error: (error) => {
        console.error('Error al obtener las notas: ', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalReloj) {
      clearInterval(this.intervalReloj);
    }

    if (this.intervalClima) {
      clearInterval(this.intervalClima);
    }
  }

  //FUNCIONES NOTAS
  sumbit(event: Event) {
    event.preventDefault();
    const noteData = this.noteForm.value;

    // Crear Nota
    if (this.creating) {
      this._apiAuth.newNote(noteData.title, noteData.descrip);

      // Editar Nota
    } else {

      const noteId = this.noteForm.get('id')?.value;
      if (noteId) {
        this._apiAuth.editNote(noteId, noteData.title, noteData.descrip);
        this.cancelEditBtn();
      } else {
        console.error("No se encontró el ID de la Nota al Editar.");
      }
    }

  }

  editNoteBtn(id: string) {
    this.creating = false;
    this._apiAuth.getNote(id).then((noteData) => {
      if (noteData) {
        this.noteForm.patchValue({
          title: noteData['titulo'],
          descrip: noteData['descripcion'],
          id: id
        });
      }
    }).catch((error) => {
      console.log("Error al Obtener Nota: ", error)
    })

  }

  cancelEditBtn() {
    this.noteForm.patchValue({
      title: '',
      descrip: ''
    })
    this.creating = true;
  }

  async deleteNote(id: string) {
    // Agregar Confirmacion de Borrado
    this._apiAuth.delNote(id);
  }

  //FUNCIONES RELOJ
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

  //FUNCIONES CLIMA 
  getWeather(ciudad: string, pais: string) {
    this._apiWeather.getWeatherByCity(ciudad, pais).subscribe((data: IWeather) => {
      this.weatherDetail = data
      this.convC = Math.floor(data.main.temp - this.kelvinDiff);
      this.loadingWeath = false;
    });
  }

  logOut() {
    this._apiAuth.logOut();

    setTimeout(() => {
      this._router.navigate(['login'])
    }, 1500);
  }

  getUID() {
    const UID = this._apiAuth.getCurrentUID()
    console.log("UID Actual: ", UID)
  }

  getData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._apiAuth.getUserDocument().subscribe(
        (userData) => {
          console.log('Datos Obtenidos: ', userData);

          this.nombre = userData.name;
          this.vocacion = userData.vocacion
          // Ajustar WClima para Ciudad y Pais Vacios
          this.configCiudad = userData.ciudad;
          this.configPais = userData.pais;
          this.configClima = userData.wWeather;
          this.configReloj = userData.wClock;

          resolve(); // Datos cargados con éxito
        },
        (error) => {
          console.error('Error al Obtener Datos: ', error);
          reject(error); // Error al cargar los datos
        }
      );
    });
  }
}

