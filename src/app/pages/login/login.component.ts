import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Credential } from '../../../models/login.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  loginForm!: FormGroup;

  private _auth = inject(AuthService)
  private _router = inject(Router)

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required]
    })
  }

  async acceder() {
    const credential: Credential = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.pass || ''
    }

    try {
      this._auth.logInEmailNPass(credential);
      this._router.navigate(['home'])
    } catch (error) {
      console.log(error)
    }
  }



}
