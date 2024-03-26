import { Component } from '@angular/core';
import { SignupMainpageComponent } from '../../component/signup-mainpage/signup-mainpage.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SignupMainpageComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

}
