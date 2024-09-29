import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credential } from '../../../models/login.model';
import { Router, RouterLink } from '@angular/router';
import { Toast } from "bootstrap";
import { FirestoreService } from '../../services/firestore.service';

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
  private _firestore = inject(FirestoreService)
  private _router = inject(Router)

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required],
    })
  }


  async registro() {
  const credential: Credential = {
    email: this.registerForm.value.email || '',
    password: this.registerForm.value.pass || ''
  }

  try {
    //Creación en Auth
    const userCred = await this._apiAuth.crearUsuarioEmailNPass(credential);

    //Verificación de éxito en la creación del usuario
    if (userCred && userCred.user) {
      //Creación en Firestore
      await this._firestore.newUser(
        this.registerForm.value.name,
        this.registerForm.value.username,
        this.registerForm.value.email
      );

      console.log('Registro Realizado');
    }
  } catch (error) {
    console.error('Error durante el registro: ', error);
  }
}

  mostrarToast() {
    const toastEl = document.getElementById('liveToast');

    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000
      });
      toast.show();
    }
  }

}
