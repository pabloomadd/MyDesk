import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfigsService } from '../../services/configs.service';
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
  private _apiConfig = inject(ConfigsService);
  private _apiAuth = inject(AuthService);

  ciudad?: string;
  pais?: string;

  configClima?: boolean;
  configReloj?: boolean;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.getData();

    //Inicializar settingsForm
    this.settingsForm = this.formBuilder.group({
      wReloj: [this.configReloj],
      wClima: [this.configClima],
      ciudad: [this.ciudad],
      pais: [this.pais]
    })

  }

  async guardarAjustes() {
    if (this.settingsForm.valid) {
      const updatedConfig: AppConfig = this.settingsForm.value;
      console.log(updatedConfig);

      // Actualizar en Firestore
      await this._apiAuth.editUserDocument(updatedConfig);

      alert("Ajustes Guardados");
    }
  }

  getData() {
    this._apiAuth.getUserDocument().subscribe(
      (userData) => {
        console.log('Datos Obtenidos: ', userData);

        // Actualizar los valores del formulario con patchValue
        this.settingsForm.patchValue({
          ciudad: userData.ciudad,
          pais: userData.pais,
          wClima: userData.wWeather,
          wReloj: userData.wClock
        });
      },
      (error) => {
        console.error('Error al Obtener Datos: ', error);
      }
    );
  }

}
