import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credential } from '../../../models/login.model';
import { Router, RouterLink } from '@angular/router';
import { Toast } from "bootstrap";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  private _apiAuth = inject(AuthService)
  private _router = inject(Router)

  registerForm!: FormGroup;

  isPassVisible: boolean = false;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email, Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    })
  }


  async registro() {
    if (this.registerForm.valid) {
      const username = this.registerForm.value.username || '';

      try {
        // Verificar si el username ya está en uso
        const usernameExists = await this._apiAuth.checkUsernameExists(username);

        if (usernameExists) {
          console.error('El nombre de usuario ya está en uso');
          this.toastMal('El Nombre de Usuario ya está en uso');
          return; // Detener el registro
        }

        const credential: Credential = {
          email: this.registerForm.value.email || '',
          password: this.registerForm.value.pass || ''
        };

        const userCred = await this._apiAuth.crearUsuarioEmailNPass(credential);

        await this._apiAuth.logOut();

        const uid = userCred?.user?.uid;
        if (uid) {
          await this._apiAuth.newUser(
            this.registerForm.value.name,
            username,
            this.registerForm.value.email,
            uid
          );
        }

        console.log('Registro realizado con éxito');
        this.toastBien();

      } catch (error) {
        console.error('Error durante el registro: ', error);
        this.toastMal('El Correo Electrónico ya está en uso');
      }
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return this.registerForm.get(controlName)?.hasError(errorType) && this.registerForm.get(controlName)?.touched;
  }

  toastBien() {
    const toastEl = document.getElementById('liveToast');

    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 2000
      });
      toast.show();
    }
  }

  togglePassVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  toastMal(message: string) {
    const toastEl = document.getElementById('errorToast');
    const messageEl = document.getElementById('errorToastMsg');

    if (toastEl && messageEl) {
      // Actualizar el mensaje del toast
      messageEl.textContent = message;

      // Mostrar el toast
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000
      });
      toast.show();
    }
  }

}
