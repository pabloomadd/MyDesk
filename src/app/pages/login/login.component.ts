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

  loginForm!: FormGroup;
  

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      pass: ['', Validators.required]
    })
  }



  private _auth = inject(AuthService)
  private _router = inject(Router)

  ngOnInit() {

  }

  async acceder() {
    if (this.loginForm.valid) {
      const credential: Credential = {
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.pass || ''
      }

      try {
        await this._auth.logInEmailNPass(credential);
        this.toastBien(); 

        setTimeout(() => {
          this._router.navigate(['home']);
        }, 1200);
      } catch (error) {
        
        this.toastMal();
      }
    } else {
      this.toastMal(); 
    }
  }

  hasErrors(controlName: string, errorType: string) {
    return this.loginForm.get(controlName)?.hasError(errorType) && this.loginForm.get(controlName)?.touched;
  }

  toastBien() {
    const toastEl = document.getElementById('liveToast');

    if (toastEl) {

      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000
      });
      toast.show();
    }
  }

  toastMal() {
    const toastEl = document.getElementById('dangerToast');

    if (toastEl) {

      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000
      });
      toast.show();
    }
  }


}
