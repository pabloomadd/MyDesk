import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Credential } from '../../../models/login.model';
import { Router, RouterLink } from '@angular/router';
import { Toast } from "bootstrap";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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

    this._auth.logInEmailNPass(credential);

    setTimeout(() => {
      this._router.navigate(['home'])
    }, 1200);

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
