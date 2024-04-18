import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Initializing FormControl for username input
  username = new FormControl;
  // Declaring a boolean variable for login status
  isLogged!: boolean;

  // Constructor for the component, injecting Router
  constructor(private route: Router) {
    // Subscribing to router events to detect route changes
    this.route.events.subscribe(value => {
      // Checking if the current route is '/homePage'
      if (this.route.url == '/homePage') {
        // Setting isLogged to true if on the '/homePage' route
        this.isLogged = true;
      } else {
        // Setting isLogged to false if not on the '/homePage' route
        this.isLogged = false
      }
    });
  }

  // Declaring an EventEmitter for emitting the username
  @Output() emitUserName: EventEmitter<string> = new EventEmitter<string>();

  // Method to emit the username
  sendUserName() {
    // Checking if the username FormControl is valid
    if (this.username.valid) {
      // Emitting the username value
      this.emitUserName.emit(this.username.value);

    }
  }

  // Method to navigate to the sign-up page
  navToSignUp() {
    // Clearing sessionStorage
    sessionStorage.clear();
    // Navigating to the '/signUp' route
    this.route.navigateByUrl('/signUp');
  }

  // Method to navigate to the home page
  navToHome() {
    // Clearing sessionStorage
    sessionStorage.clear();
    // Navigating to the '/home' route
    this.route.navigateByUrl('/home');
  }

  // Method to navigate to the login page
  navToLogin() {
    // Clearing sessionStorage
    sessionStorage.clear();
    // Navigating to the '/login' route
    this.route.navigateByUrl('/login');
  }

}
