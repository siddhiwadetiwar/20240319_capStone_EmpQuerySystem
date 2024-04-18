import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../component/navbar/navbar.component';
import { HomepageMaincontentComponent } from '../../component/homepage-maincontent/homepage-maincontent.component';
import { HomepageSidebarComponent } from '../../component/homepage-sidebar/homepage-sidebar.component';
import { PostService } from '../../post.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [NavbarComponent, HomepageMaincontentComponent, HomepageSidebarComponent, RouterModule],
  providers: [PostService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  // Constructor for the component, injecting PostService and Router
  constructor(private postService: PostService, private route: Router) {
    // Getting token from sessionStorage
    let token = sessionStorage.getItem('token');
    // Checking if token is null or empty, and redirecting to the root URL if true
    if (token == null || token == "") {
      this.route.navigateByUrl("/");
    }
  }

  // ViewChild decorator to access HomepageMaincontentComponent
  @ViewChild(HomepageMaincontentComponent) child!: HomepageMaincontentComponent;

  // Method triggered when filter is clicked, passing the event to HomepageMaincontentComponent
  filterClicked(event: any) {
    this.child.getPostbyType(event);
  }

  // Method triggered to filter posts by username, passing the event to HomepageMaincontentComponent
  filterByUserName(event: any) {
    this.child.getPostsByUsername(event);
  }

}
