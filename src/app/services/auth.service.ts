import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../environments/environment.development';
import { Credential } from '../../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseConfig = environment.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

  crearUsuarioEmailNPass(credential: Credential) {
    createUserWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const erroCode = error.code;
        const errorMsg = error.message;
        console.log('Error al Registrarse')
        console.log('Codigo de Error: ', erroCode)
        console.log('Mesnaje de Error: ', errorMsg)
      })
  }

  logInEmailNPass(credential: Credential) {
    signInWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const erroCode = error.code;
        const errorMsg = error.message;
        console.log('Error al Registrarse')
        console.log('Codigo de Error: ', erroCode)
        console.log('Mesnaje de Error: ', errorMsg)
      })

  }
}
