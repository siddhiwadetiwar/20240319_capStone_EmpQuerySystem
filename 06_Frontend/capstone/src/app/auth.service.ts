import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from './models/login';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000/'; // Replace 'your-api-url' with your actual API URL

  constructor(private http: HttpClient) { }

  signIn(signIn: Login): Observable<any> {
     return this.http.post<any>(this.baseUrl+"auth/signin", signIn).pipe(
      catchError(error => {
        console.log(error.error.message)
        this.displaySnackBar(error.error.message);
        // console.error('Error filterPostByUser', error);
        throw new Error('Error filterPostByUser');
      })
    );


   }

   signUp(signUp: Login): Observable<any> {
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
