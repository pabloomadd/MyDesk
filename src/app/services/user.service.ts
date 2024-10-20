import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userData: any;

  constructor() { }

  setUserData(data: any): void {
    this.userData = data;
    localStorage.setItem('userData', JSON.stringify(data)); 
  }

  getUserData(): any {
    if (this.userData) {
      return this.userData;  
    }

    const savedData = localStorage.getItem('userData');
    if (savedData) {
      this.userData = JSON.parse(savedData);
      return this.userData;
    }
    return null;  
  }

}
