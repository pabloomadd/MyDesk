import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppConfig } from '../../../models/config.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  settingsForm!: FormGroup
  private _apiAuth = inject(AuthService);

  ciudad?: string;
  pais?: string;

  configClima?: boolean;
  configReloj?: boolean;


  constructor(private formBuilder: FormBuilder) {
    this.settingsForm = this.formBuilder.group({
      wClock: [this.configReloj],
      wWeather: [this.configClima],
      ciudad: [this.ciudad],
      pais: [this.pais]
    })
  }

  ngOnInit(): void {
    this.getData();

  }

  async guardarAjustes() {
    if (this.settingsForm.valid) {
      const updatedConfig: AppConfig = this.settingsForm.value;
      console.log(updatedConfig);

      await this._apiAuth.editUserDocument(updatedConfig);

      const existingData = localStorage.getItem('userData');
      if (existingData) {
        const userData = JSON.parse(existingData);

        if (updatedConfig.wReloj) {
          userData.wClock = updatedConfig.wReloj;
        }
        if (updatedConfig.wClima) {
          userData.wWeather = updatedConfig.wClima;
        }
        if (updatedConfig.ciudad) {
          userData.cudad = updatedConfig.ciudad;
        }
        if (updatedConfig.pais) {
          userData.pais = updatedConfig.pais;
        }

        localStorage.setItem('userData', JSON.stringify(userData));
      }

      alert("Ajustes Guardados");
    }
  }

  getData() {
    this._apiAuth.getUserDocument().subscribe(
      (userData) => {
        console.log('Datos Obtenidos: ', userData);

        this.configReloj = userData.wClock;
        this.configClima = userData.wWeather;
        this.ciudad = userData.ciudad;
        this.pais = userData.pais;

        this.settingsForm.patchValue({
          wClock: userData.wClock,
          wWeather: userData.wWeather,
          ciudad: userData.ciudad,
          pais: userData.pais
        });

      },
      (error) => {
        console.error('Error al Obtener Datos: ', error);

        const savedData = localStorage.getItem('userData');
        if (savedData) {
          const userData = JSON.parse(savedData);

          this.settingsForm.patchValue({
            wClock: userData.wClock,
            wWeather: userData.wWeather,
            ciudad: userData.ciudad,
            pais: userData.pais
          });

          this.configReloj = userData.wClock;
          this.configClima = userData.wWeather;
          this.ciudad = userData.ciudad;
          this.pais = userData.pais;
        }
      }
    );
  }

}
