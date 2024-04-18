import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from './models/login';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://only-credit-backend.vercel.app/'; 

  // Injecting HttpClient service into the constructor
  constructor(private http: HttpClient) { }

  /**
   * Method to sign in a user
   * @param {signIn} - Object containing user's login credentials
   */
  signIn(signIn: Login){
     return this.http.post<any>(this.baseUrl+"auth/signin", signIn).pipe(
      catchError(error => {
        console.log(error.error.message)
        this.displaySnackBar(error.error.message);
        throw new Error('Error filterPostByUser');
      })
    );
   }

   /**
   * Method to sign up a user
   * @param signUp - Object containing user's registration details
   */
   signUp(signUp: Login){
    return this.http.post<any>(this.baseUrl + "auth/signup", signUp).pipe(
      catchError(error => {
        
        this.displaySnackBar(error.error.message);
        console.error('Error filterPostByUser', error);
        throw new Error('Error filterPostByUser');
      })
    );;
  } 
  
  displaySnackBar(msg: any) {
    console.log("***")
    const snackBar = document.getElementById("snackBar");
    if (snackBar != null) {
      snackBar.innerHTML = msg
      snackBar.style.display = "block";
    }
    setTimeout(function () {
      if (snackBar != null) {
        snackBar.style.display = "none";
      }
    }, 3000);
  }
}
