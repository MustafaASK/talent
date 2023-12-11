import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  setToken(token:string): void {
    localStorage.setItem("userToken", token);

  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  isLoggedUserIn(){
    return localStorage.getToken()!= null;
  }

  // logout(){
  //   localStorage.removeItem("userToken");
  //   this.router.navigate(['login'])
  // }
}
