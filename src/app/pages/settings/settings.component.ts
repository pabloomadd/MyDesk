import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppConfig } from '../../../models/config.model';
import { AuthService } from '../../services/auth.service';
import { Toast } from 'bootstrap';

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

  saving?: boolean;


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
    this.saving = false;

  }

  async guardarAjustes() {
    if (this.settingsForm.valid) {
      this.saving = true;

      const updatedConfig: AppConfig = this.settingsForm.value;

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
          userData.ciudad = updatedConfig.ciudad;
        }
        if (updatedConfig.pais) {
          userData.pais = updatedConfig.pais;
        }

        localStorage.setItem('userData', JSON.stringify(userData));
      }

      this.saving = false;
      this.toastSave()
    }
  }

  getData() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const userData = JSON.parse(savedData);

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

    } else {
      this._apiAuth.getUserDocument().subscribe(
        (userData) => {

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

          const { userid, ...userDataWithoutId } = userData;
          localStorage.setItem('userData', JSON.stringify(userDataWithoutId));
        },
        (error) => {
          console.error('Error al Obtener Datos: ', error);
        }
      );
    }
  }

  toastSave() {
    const toastEl = document.getElementById('toastSave');

    if (toastEl) {

      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000
      });
      toast.show();
    }
  }

}
