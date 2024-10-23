import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AppConfig } from '../../../models/config.model';
import { Data } from '../../../models/userdata,model';
import { Toast } from 'bootstrap';

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

  imageUrls: string[] = [];
  selectedAvatar: string | null = null;
  userId: string = '';
  avatarImg?: string;

  saving?: boolean;

  isPassVisible: boolean = false;

  constructor(private formBuilder: FormBuilder) {

    this.userForm = this.formBuilder.group({
      name: [this.nombre || '', Validators.required],
      vocacion: [this.vocacion || '', Validators.required],
      username: [this.usuario || '', Validators.required],
      email: [this.correo || [Validators.required, Validators.email]]
    });

    this.passForm = this.formBuilder.group({
      actualPass: ['', [Validators.required, Validators.minLength(6)]],
      nuevaPass: ['', [Validators.required, Validators.minLength(6)]],

    })
  }

  ngOnInit(): void {
    this.getData();
    this.saving = false;
  }

  getData() {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const userData = JSON.parse(savedData);

      this.userForm.patchValue({
        name: userData.name || '',
        vocacion: userData.vocacion || '',
        username: userData.username || '',
        email: userData.email || ''
      });

      this.avatarImg = userData.avatar;
      this.nombre = userData.name;
      this.vocacion = userData.vocacion;
      this.usuario = userData.username;
      this.correo = userData.email;
    } else {
      this._apiAuth.getUserDocument().subscribe(
        (userData) => {
          console.log('Datos Obtenidos: ', userData);

          this.avatarImg = userData.avatar;
          this.nombre = userData.name;
          this.vocacion = userData.vocacion;
          this.usuario = userData.username;
          this.correo = userData.email;

          this.userForm.patchValue({
            name: userData.name,
            vocacion: userData.vocacion,
            username: userData.username,
            email: userData.email
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
      this.saving = true;

      const updatedConfig: Data = this.userForm.value;
      console.log(updatedConfig);

      await this._apiAuth.editUserDocument(updatedConfig);

      const existingData = localStorage.getItem('userData');
      if (existingData) {
        const userData = JSON.parse(existingData);

        if (updatedConfig.name) {
          userData.nombre = updatedConfig.name;
        }
        if (updatedConfig.vocacion) {
          userData.vocacion = updatedConfig.vocacion;
        }
        if (updatedConfig.email) {
          userData.correo = updatedConfig.email;
        }

        localStorage.setItem('userData', JSON.stringify(userData));
      }

      this.saving = false;
      this.toastSave();
    }
  }

  getAvs() {
    this._apiAuth.listImages().then((urls) => {
      this.imageUrls = urls;
      console.log("URLs de imágenes:", this.imageUrls);
    }).catch((error) => {
      console.error("Error al obtener las imágenes: ", error);
    });
  }

  selectAvatar(url: string) {
    this.selectedAvatar = url;
    console.log("Avatar seleccionado:", url);
  }

  saveAvatar() {
    if (this.selectedAvatar) {
      this._apiAuth.saveAvatar(this.selectedAvatar)
        .then(() => {
          console.log('Avatar guardado correctamente');
        })
        .catch((error) => {
          console.error('Error al guardar el avatar:', error);
        });
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return this.passForm.get(controlName)?.hasError(errorType) && this.passForm.get(controlName)?.touched;
  }

  togglePassVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  resetPassForm(){
    this.passForm.reset();
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
