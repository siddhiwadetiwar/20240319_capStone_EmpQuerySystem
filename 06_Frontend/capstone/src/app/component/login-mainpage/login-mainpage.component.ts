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
export class LoginMainpageComponent implements OnInit{
  myForm!: FormGroup;
  login: Login = new Login();

  constructor(httpclient: HttpClient, private authservice:AuthService,private route: Router) {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  ngOnInit(): void {
    sessionStorage.removeItem('token');
    sessionStorage.clear();
  }



  onSubmit() {
    console.log(this.login);

    this.authservice.signIn(this.login).subscribe(res => {
      console.log(res);
      sessionStorage.setItem('token', res.token);

      if (res.token != null) {
        this.displaySnackBar("Login successful");
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
