import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '../../models/login';
import { Response } from '../../models/response';

@Component({
  selector: 'app-signup-mainpage',
  standalone: true,
  imports: [FormsModule, HttpClientModule, ReactiveFormsModule, CommonModule, RouterModule],
  providers: [AuthService],
  templateUrl: './signup-mainpage.component.html',
  styleUrl: './signup-mainpage.component.css'
})


export class SignupMainpageComponent {
  // Initializing Login model for user data
  login: Login = new Login();
  // Initializing FormGroup for form validation
  myForm!: FormGroup;

  // Constructor for the component, injecting HttpClient, AuthService, and Router
  constructor(httpclient: HttpClient, private authService: AuthService, private route: Router) {
    // Removing 'token' from sessionStorage
    sessionStorage.removeItem('token');
    // Clearing sessionStorage
    sessionStorage.clear();
    // Creating a new FormGroup for form controls
    this.myForm = new FormGroup({
      // Initializing FormControl for email input with required validation
      email: new FormControl('', [Validators.required]),
      // Initializing FormControl for username input with required validation
      username: new FormControl('', [Validators.required]),
      // Initializing FormControl for password input with required validation
      password: new FormControl('', [Validators.required])
    });
  }

  // Initializing Response model for API response data
  response: Response = new Response();

  // Method triggered on form submission
  onSubmit() {
    console.log(this.login)

    // Calling signUp method from AuthService and subscribing to the API response
    this.authService.signUp(this.login).subscribe(res => {
      console.log(res);
      // Assigning the API response to the Response model
      this.response = res;
      // Displaying a snackBar message based on the API response
      this.displaySnackBar(this.response.message)
      // Checking if the response message indicates successful user creation
      if (this.response.message == "User created successfully") {
        // Navigating to the 'login' route upon successful user creation
        this.route.navigateByUrl('login');
      }
    });

  }

  displaySnackBar(msg: any) {
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