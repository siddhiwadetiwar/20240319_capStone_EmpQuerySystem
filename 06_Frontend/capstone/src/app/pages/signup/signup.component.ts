import { Component } from '@angular/core';
import { SignupMainpageComponent } from '../../component/signup-mainpage/signup-mainpage.component';
import { NavbarComponent } from '../../component/navbar/navbar.component';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SignupMainpageComponent, NavbarComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

}
