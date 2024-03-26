import { Component } from '@angular/core';
import { LoginMainpageComponent } from '../../component/login-mainpage/login-mainpage.component';
import { NavbarComponent } from '../../component/navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginMainpageComponent, NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
