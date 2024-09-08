import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { INote } from '../../models/note.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _http = inject(HttpClient);
  private firebaseConfig = environment.firebaseConfig;

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
