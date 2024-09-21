import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserdataService } from '../../services/userdata.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Data } from '../../../models/userdata,model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  userForm!: FormGroup;
  private _apiData = inject(UserdataService);

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const data: Data = this._apiData.getUserData();

    this.userForm = this.formBuilder.group({
      nombre: [data.nombre],
      apellido: [data.apellido],
      vocacion: [data.vocacion],
      username: [data.username],
      email: [data.email]

    })
  }

  guardarDatos() {
    if (this.userForm.valid) {
      const updatedData: Data = this.userForm.value;

      //Actualizar cada Valor
      for (const key in updatedData) {
        if (updatedData.hasOwnProperty(key)) {
          //Asegura el tipo de key de AppConfig Interface
          const typedKey = key as keyof Data;
          this._apiData.updateDataValue(key as keyof Data, updatedData[typedKey]);
        }
      }
      alert("Datos de Perfil Guardados")
    }
  }
}
