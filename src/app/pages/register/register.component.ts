import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credential } from '../../../models/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  private _apiAuth = inject(AuthService)
  private _router = inject(Router)

  registerForm!: FormGroup;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required]
    })
  }


  async registro() {

    const credential: Credential = {
      email: this.registerForm.value.email || '',
      password: this.registerForm.value.pass || ''
    }

    try {
      this._apiAuth.crearUsuarioEmailNPass(credential)
      this._router.navigate([''])

    } catch (error) {
      console.error("Error de Front a Registrar: ", error)
    }

    this.registerForm.value;
  }

  botonHome() {
    this._router.navigate([''])
  }


}