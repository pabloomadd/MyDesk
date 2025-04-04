import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Credential } from '../../../models/login.model';
import { Router } from '@angular/router';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isPassVisible: boolean = false;

  fecha = new Date();
  annio!: number;

  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private _auth = inject(AuthService);
  private _router = inject(Router);

  ngOnInit() {
    this.getDate();
  }

  async acceder() {
    if (this.loginForm.valid) {
      const credential: Credential = {
        email: this.loginForm.value.email || '',
        password: this.loginForm.value.pass || '',
      };

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

  demoLogin() {
    this._auth
      .loginAsDemo()
      .then(() => {
        console.log('Logged in as Demo');
        this._router.navigate(['/home']);
      })
      .catch((error) => {
        console.error('Error in Demo:', error);
        this.toastLoginDemo();
      });
  }

  hasErrors(controlName: string, errorType: string) {
    return (
      this.loginForm.get(controlName)?.hasError(errorType) &&
      this.loginForm.get(controlName)?.touched
    );
  }

  togglePassVisible() {
    this.isPassVisible = !this.isPassVisible;
  }

  toastBien() {
    const toastEl = document.getElementById('liveToast');

    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000,
      });
      toast.show();
    }
  }

  toastMal() {
    const toastEl = document.getElementById('dangerToast');

    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 3000,
      });
      toast.show();
    }
  }

  toastLoginDemo() {
    const toastEl = document.getElementById('demoDanger');

    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 5000,
      });
      toast.show();
    }
  }

  getDate() {
    this.annio = this.fecha.getFullYear();
  }
}
