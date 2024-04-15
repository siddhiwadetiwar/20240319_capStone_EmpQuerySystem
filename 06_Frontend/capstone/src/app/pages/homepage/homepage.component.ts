import { Component, ViewChild  } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { HomepageMaincontentComponent } from '../../component/homepage-maincontent/homepage-maincontent.component';
import { HomepageSidebarComponent } from '../../component/homepage-sidebar/homepage-sidebar.component';
import { PostService } from '../../post.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent, HomepageMaincontentComponent, HomepageSidebarComponent,RouterModule],
  providers:[PostService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  constructor(private postService:PostService,private route:Router) {
let token=sessionStorage.getItem('token');
if(token == null ||token == ""){
  this.route.navigateByUrl("/");
}    
   }
   @ViewChild(HomepageMaincontentComponent) child!: HomepageMaincontentComponent;

   filterClicked(event:any){
    this.child.getPostbyType(event);
   }

   filterByUserName(event:any){
    this.child.getPostsByUsername(event);
   }
  
}
