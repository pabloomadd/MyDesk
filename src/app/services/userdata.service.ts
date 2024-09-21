import { Injectable } from '@angular/core';
import { Data } from '../../models/userdata,model';

@Injectable({
  providedIn: 'root'
})
export class UserdataService {

  private userData: Data = {
    nombre: 'John',
    apellido: 'Doe',
    vocacion: 'Gerente de Medicina',
    username: 'JohnDoe256',
    email: 'johndoe256@mail.com'
  }

  getUserData(){
    return this.userData;
  }

  updateData(updatedData: Data){
    this.userData = updatedData
  }

  updateDataValue<T extends keyof Data>(key: T, value: Data[T]) {
    this.userData[key] = value;
  }
}
