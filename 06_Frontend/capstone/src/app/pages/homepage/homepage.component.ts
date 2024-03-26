import { Component } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { HomepageMaincontentComponent } from '../../component/homepage-maincontent/homepage-maincontent.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent, HomepageMaincontentComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
