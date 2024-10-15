import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, signInWithEmailAndPassword, updatePassword, User, UserCredential } from 'firebase/auth';
import { addDoc, collection, getFirestore, onSnapshot, deleteDoc, doc, getDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { environment } from '../../environments/environment.development';
import { Credential } from '../../models/login.model';
import { INote } from '../../models/note.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseConfig = environment.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  storage = getStorage(this.app, environment.storageBucket);

  ///AUTH

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
    return createUserWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then((userCredential: UserCredential) => {
        console.log('Usuario Creado');
        return userCredential;
      })
      .catch((error) => {

        const errorCode = error.code;
        const errorMsg = error.message;
        console.log('Error al Registrarse');
        console.log('Código de Error: ', errorCode);
        console.log('Mensaje de Error: ', errorMsg);

        if (errorCode === 'auth/email-already-in-use') {
          console.log("Usuario en Uso");
        }
        throw error;
      });
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const q = query(collection(this.db, 'users'), where('username', '==', username));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty; // Retorna true si ya existe un usuario con ese username
  }

  logInEmailNPass(credential: Credential): Promise<void> {
    return signInWithEmailAndPassword(this.auth, credential.email, credential.password)
      .then((userCredential) => {

        const user = userCredential.user;
        console.log('Usuario autenticado:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMsg = error.message;

        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
          console.error('Error: Contraseña Incorrecta.');
        } else {

          console.error('Error al loguearse:', errorMsg);
        }

        throw error;
      });
  }

  async reautenticarUsuario(passwordActual: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, passwordActual);
      try {
        await reauthenticateWithCredential(user, credential);
        console.log('Reautenticación exitosa');
      } catch (error) {
        console.error('Error en la reautenticación:', error);
        throw error;
      }
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }

  async cambiarContraseña(nuevaPassword: string): Promise<void> {
    const user = this.auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, nuevaPassword);
        console.log('Contraseña actualizada con éxito');
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        throw error;
      }
    } else {
      throw new Error('No hay usuario autenticado');
    }
  }

  logOut() {
    return this.auth.signOut();
  }


  ///USERDATA
  getCurrentUID() {
    return this.auth.currentUser?.uid
  }

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

  getUserDocument(): Observable<any> {
    return new Observable((observer) => {

      const uid = this.getCurrentUID();

      if (!uid) {
        observer.error('No se pudo obtener el UID del usuario');
        return;
      }

      const userCollection = query(collection(this.db, 'users'), where('userid', '==', uid));

      const unsubscribe = onSnapshot(userCollection, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          observer.next(userDoc.data());
        } else {
          observer.error('El documento del usuario no existe');
        }
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  async editUserDocument(updatedData: any): Promise<void> {

    const uid = this.getCurrentUID();

    if (!uid) {
      throw new Error('No se pudo obtener el UID del usuario');
    }

    try {
      const userCollection = query(collection(this.db, 'users'), where('userid', '==', uid)
      );


      const querySnapshot = await getDocs(userCollection);

      if (!querySnapshot.empty) {

        const userDoc = querySnapshot.docs[0];

        const userDocRef = doc(this.db, 'users', userDoc.id);
        await updateDoc(userDocRef, updatedData);

        console.log('Documento del usuario actualizado correctamente');
      } else {
        throw new Error('El documento del usuario no existe');
      }
    } catch (error) {
      console.error('Error al actualizar el documento del usuario:', error);
      throw error;
    }
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

      const notesCollection = query(collection(this.db, 'notes'), where('uid', '==', uid));

      // Escucha en tiempo real con onSnapshot
      const unsubscribe = onSnapshot(notesCollection, (querySnapshot) => {
        notes.length = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const note: INote = {
            id: doc.id,
            titulo: data['titulo'],
            descripcion: data['descripcion']
          };
          notes.push(note);
        });

        observer.next(notes);
      }, (error) => {
        observer.error(error);
      });

      return () => unsubscribe();
    });
  }

  async newNote(title: string, descrip: string) {
    try {
      const uid = this.getCurrentUID();

      if (!uid) {
        throw new Error('No se pudo obtener el UID del usuario');
      }

      const docRef = await addDoc(collection(this.db, "notes"), {
        titulo: title,
        descripcion: descrip,
        uid: uid
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

  //STORAGE

  listImages(): Promise<string[]> {
    const listRef = ref(this.storage, 'avs');

    return listAll(listRef).then((res) => {
      const urls: string[] = [];
      const promises = res.items.map((itemRef) => {
        return getDownloadURL(itemRef).then((url) => {
          urls.push(url);
        });
      });
      return Promise.all(promises).then(() => urls);
    }).catch((error) => {
      console.error("Error al obtener los archivos: ", error);
      return [];
    });
  }

  async saveAvatar(avatarUrl: string): Promise<void> {
    const uid = this.getCurrentUID();

    if (!uid) {
      throw new Error('No se pudo obtener el UID del usuario');
    }

    try {
      const userCollection = query(collection(this.db, 'users'), where('userid', '==', uid));
      const querySnapshot = await getDocs(userCollection);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = doc(this.db, 'users', userDoc.id);

        await updateDoc(userDocRef, { avatar: avatarUrl });

        console.log('Avatar actualizado exitosamente');
      } else {
        throw new Error('No se encontró el documento del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar el avatar:', error);
      throw error;
    }
  }
}
