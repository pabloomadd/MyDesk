import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, User, UserCredential } from 'firebase/auth';
import { addDoc, collection, getFirestore, onSnapshot, deleteDoc, doc, getDoc, updateDoc, query, where } from "firebase/firestore";
import { environment } from '../../environments/environment.development';
import { Credential } from '../../models/login.model';
import { INote } from '../../models/note.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseConfig = environment.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);

  //AUTH

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
  getCurrentUID() {
    return this.auth.currentUser?.uid
  }

  async getUserData() {

  }


  //FIRESTORE 

  //NOTAS
  getNotes(): Observable<INote[]> {
    return new Observable((observer) => {
      const notes: INote[] = [];

      // Obtén el UID del usuario actual
      const uid = this.getCurrentUID();

      if (!uid) {
        observer.error('No se pudo obtener el UID del usuario');
        return;
      }

      // Filtra las notas por el campo 'uid'
      const notesCollection = query(collection(this.db, 'notes'), where('uid', '==', uid));

      // Escucha en tiempo real con onSnapshot
      const unsubscribe = onSnapshot(notesCollection, (querySnapshot) => {
        notes.length = 0; // Limpiar el array para evitar duplicados

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const note: INote = {
            id: doc.id, // Usa doc.id como identificador
            titulo: data['titulo'],
            descripcion: data['descripcion']
          };
          notes.push(note);
        });

        observer.next(notes); // Emite los cambios a los observadores
      }, (error) => {
        observer.error(error); // Maneja el error
      });

      // Retorna la función de limpieza cuando el observable se complete
      return () => unsubscribe();
    });
  }

  async newNote(title: string, descrip: string) {
    try {
      // Obtener el UID del usuario actual
      const uid = this.getCurrentUID();
  
      if (!uid) {
        throw new Error('No se pudo obtener el UID del usuario');
      }
  
      // Agregar la nota a la colección con el UID
      const docRef = await addDoc(collection(this.db, "notes"), {
        titulo: title,
        descripcion: descrip,
        uid: uid // Añadir el UID del usuario a la nota
      });
  
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  async getNote(id: string) {
    const docRef = doc(this.db, "notes", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("Ese registro no existe!");
    }
    return docSnap.data();
  }

  async editNote(id: string, title: string, descrip: string) {
    const noteRef = doc(this.db, "notes", id)
    await updateDoc(noteRef, {
      titulo: title,
      descripcion: descrip
    })
  }

  async delNote(id: string) {
    await deleteDoc(doc(this.db, "notes", id));
  }

  //USERDATA
  async newUser(nombre: string, username: string, email: string, uid: string) {
    try {
      const docRef = await addDoc(collection(this.db, "users"), {
        name: nombre,
        username: username,
        email: email,
        vocacion: '',
        ciudad: '',
        pais: '',
        //Configs
        widgets: true,
        wClock: true,
        wWeather: true,
        userid: uid
      });
      console.log("Datos del Usuario Creados")
      console.log("Usuario Creado ID: ", docRef.id);

    } catch (error) {
      console.error("Error al Agregar Usuario: ", error);
    }
  }

}
