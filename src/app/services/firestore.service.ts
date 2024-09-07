import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { INote } from '../../models/note.model';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _http = inject(HttpClient);
  private firebaseConfig = {

    apiKey: "AIzaSyA_zpKITFuiZIwv3mH5Qwz72B33Bx97T4E",
    authDomain: "mydesk-db.firebaseapp.com",
    projectId: "mydesk-db",
    storageBucket: "mydesk-db.appspot.com",
    messagingSenderId: "159454335980",
    appId: "1:159454335980:web:97dc89e3b878249b5c66c9",
    measurementId: "G-PZS04D9H3P"

  };

  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);

  async getNotes(): Promise<INote[]> {
    const querySnapshot = await getDocs(collection(this.db, "notes"));
    const notes: INote[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Asegurarse de que los datos coincidan con el modelo INote
      const note: INote = {
        id: data['id'],
        titulo: data['titulo'],
        descripcion: data['descripcion']
      };
      notes.push(note);
    });

    return notes;  // Retorna el array de notas
  }

}
