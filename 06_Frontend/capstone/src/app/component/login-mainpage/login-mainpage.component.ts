import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../models/login';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-mainpage',
  standalone: true,
  providers:[AuthService],
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login-mainpage.component.html',
  styleUrl: './login-mainpage.component.css'
})

// Angular component class implementing OnInit interface
export class LoginMainpageComponent implements OnInit{
  // Initializing FormGroup for form handling
  myForm!: FormGroup;
  // Creating an instance of the Login model
  login: Login = new Login();

  // Constructor for the component
  constructor(httpclient: HttpClient, private authservice:AuthService,private route: Router) {
    // Initializing the form controls in the constructor
    this.myForm = new FormGroup({
      // Initializing email form control with required validator
      email: new FormControl('', [Validators.required]),
      // Initializing password form control with required validator
      password: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    // Removing token from sessionStorage
    sessionStorage.removeItem('token');
    // Clearing sessionStorage
    sessionStorage.clear();
  }

  // Method to handle form submission
  onSubmit() {
    console.log(this.login);

    // Calling the signIn method of AuthService via HTTP request
    this.authservice.signIn(this.login).subscribe(res => {
      console.log(res);
      // Storing the received token in sessionStorage
      sessionStorage.setItem('token', res.token);

      if (res.token != null) {
        this.displaySnackBar("Login successful");
        // Navigating to 'homePage' route on successful login
        this.route.navigateByUrl('homePage');
      }
    })

  }

  displaySnackBar(msg: any) {
    const snackBar = document.getElementById("snackBar");
    if (snackBar != null) {
      snackBar.innerHTML = msg;
      snackBar.style.display = "block";
    }
    setTimeout(function () {
      if (snackBar != null) {
        snackBar.style.display = "none";
      }
    }, 3000);
  }
}
