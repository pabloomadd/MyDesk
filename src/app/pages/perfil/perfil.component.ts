import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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


  private _apiAuth = inject(AuthService);
  userForm!: FormGroup;
  passForm!: FormGroup;

  nombre?: string;
  vocacion?: string;
  usuario?: string;
  correo?: string;

  constructor(private formBuilder: FormBuilder) {

    this.passForm = this.formBuilder.group({
      actualPass: ['', [Validators.required, Validators.minLength(6)]],
      nuevaPass: ['', [Validators.required, Validators.minLength(6)]],

    })
  }

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

  // Función para cambiar la contraseña
  async cambiarPass() {
    if (this.passForm.valid) {
      const passActual = this.passForm.value.actualPass;
      const newPass = this.passForm.value.nuevaPass;

      try {

        await this._apiAuth.reautenticarUsuario(passActual);

        await this._apiAuth.cambiarContraseña(newPass);
        console.log('Contraseña cambiada exitosamente');

      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
      }
    }
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
