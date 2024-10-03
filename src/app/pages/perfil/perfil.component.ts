import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppConfig } from '../../../models/config.model';
import { Data } from '../../../models/userdata,model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  userForm!: FormGroup;
  private _apiAuth = inject(AuthService);

  nombre?: string;
  vocacion?: string;
  usuario?: string;
  correo?: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getData();

    //Inicializar settingsForm
    this.userForm = this.formBuilder.group({
      name: [this.nombre],
      vocacion: [this.vocacion],
      username: [this.usuario],
      email: [this.correo]
    })
  }

  getData() {
    this._apiAuth.getUserDocument().subscribe(
      (userData) => {
        console.log('Datos Obtenidos: ', userData);

        // Actualizar los valores del formulario con patchValue
        this.userForm.patchValue({
          name: userData.name,
          vocacion: userData.vocacion,
          username: userData.username,
          email: userData.email
        });
      },
      (error) => {
        console.error('Error al Obtener Datos: ', error);
      }
    );
  }

  async guardarAjustes() {
    if (this.userForm.valid) {
      const updatedConfig: Data = this.userForm.value;
      console.log(updatedConfig);

      // Actualizar en Firestore
      await this._apiAuth.editUserDocument(updatedConfig);

      alert("Ajustes Guardados");
    }
  }
}
