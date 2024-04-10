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
  username = new FormControl('');
  isLogged!: boolean;
  constructor(private route: Router) {
    this.route.events.subscribe(value => {
      // console.log('current route: ', this.route.url.toString());
      if (this.route.url == '/homePage') {
        console.log("****")
        this.isLogged = true;
      } else {
        this.isLogged = false
      }
    });
  }
  @Output() emitUserName: EventEmitter<string> = new EventEmitter<string>();

  sendUserName() {
    const inputValue = this.username.value;
    if (inputValue && inputValue.trim().length > 0) {
      console.log('Search query:', inputValue);
      this.emitUserName.emit(inputValue);
    }
  }
  

  navToSignUp() {
    sessionStorage.clear();
    this.route.navigateByUrl('/signUp');
  }
  navToHome() {
    sessionStorage.clear();
    this.route.navigateByUrl('/home');
  }
  navToLogin() {
    sessionStorage.clear();
    this.route.navigateByUrl('/login');
  }

}
