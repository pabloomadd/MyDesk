import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Credential } from '../../../models/login.model';
import { Router, RouterLink } from '@angular/router';

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
      const userCreds = this._apiAuth.crearUsuarioEmailNPass(credential);
      console.log(credential)

      setTimeout(() => {
        this._router.navigate([''])
      }, 1500);


    } catch (error) {
      console.error("Error de Front a Registrar: ", error)
    }

    this.registerForm.value;
  }

}
