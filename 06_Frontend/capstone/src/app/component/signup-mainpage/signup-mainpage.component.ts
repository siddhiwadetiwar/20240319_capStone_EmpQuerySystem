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
  login: Login = new Login();
  myForm!: FormGroup;
  constructor(httpclient: HttpClient, private authService: AuthService, private route: Router) {
    sessionStorage.removeItem('token');
    sessionStorage.clear();
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }
  response: Response = new Response();
  onSubmit() {
    console.log(this.login)
    this.authService.signUp(this.login).subscribe(res => {
      console.log(res);
      this.response = res;
      this.displaySnackBar(this.response.message)
      if (this.response.message == "User created successfully") {
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