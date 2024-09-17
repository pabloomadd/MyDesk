import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfigsService } from '../../services/configs.service';
import { AppConfig } from '../../../models/config.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  settingsForm!: FormGroup
  private _apiConfig = inject(ConfigsService)

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    const config: AppConfig = this._apiConfig.getConfig();

    //Inicializar settingsForm
    this.settingsForm = this.formBuilder.group({
      wReloj: [config.wReloj],
      wClima: [config.wClima],
      ciudad: [config.ciudad],
      pais: [config.pais]
    })


  }

  guardarAjustes() {
    if (this.settingsForm.valid) {
      const updatedConfig: AppConfig = this.settingsForm.value;

      //Actualizar cada Valor
      for (const key in updatedConfig) {
        if (updatedConfig.hasOwnProperty(key)) {
          //Asegura el tipo de key de AppConfig Interface
          const typedKey = key as keyof AppConfig;
          this._apiConfig.updateConfigValue(key as keyof AppConfig, updatedConfig[typedKey]);
        }
      }
      alert("Cambios Guardados")
    }
  }

}
