import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth';
import { environment } from '../../environments/environment.development';
import { Credential } from '../../models/login.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseConfig = environment.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);

//SESION

  // Observable de Sesion Actual
  readonly authState$: Observable<User | null> = new Observable((observer) => {
    onAuthStateChanged(this.auth, (user => {
      onAuthStateChanged(this.auth, (user) => {
        observer.next(user); //Usuario Actual
      }, (error) => {
        observer.error(error);
      }
      )

    }));
  })

  crearUsuarioEmailNPass(credential: Credential): Promise<UserCredential> {
    // Devuelve la promesa para cumplir con el tipo declarado
    return createUserWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then((userCredential: UserCredential) => {
        console.log('Usuario Creado');
        return userCredential; // Devuelve el objeto UserCredential
      })
      .catch((error) => {
        console.log('Error al Registrarse');
        console.log('Código de Error: ', error.code);
        console.log('Mensaje de Error: ', error.message);
        throw error; // Lanza el error para manejarlo en la llamada de la función
      });
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

  logOut() {
    return this.auth.signOut();
  }

//USERDATA

}
