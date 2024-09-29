import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, onSnapshot, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { INote } from '../../models/note.model';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firebaseConfig = environment.firebaseConfig;

  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);

  
//NOTAS
  getNotes(): Observable<INote[]> {
    return new Observable((observer) => {
      const notes: INote[] = [];

      const notesCollection = collection(this.db, 'notes');

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

  async newNote(title: string, descrip: String) {
    try {
      const docRef = await addDoc(collection(this.db, "notes"), {
        titulo: title,
        descripcion: descrip
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
async newUser(nombre: string, username: string, email: string) {
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
      wWeather: true
    });
    console.log("Datos del Usuario Creados")
    console.log("Usuario Creado ID: ", docRef.id);

  } catch (error) {
    console.error("Error al Agregar Usuario: ", error);
  }
}
}
