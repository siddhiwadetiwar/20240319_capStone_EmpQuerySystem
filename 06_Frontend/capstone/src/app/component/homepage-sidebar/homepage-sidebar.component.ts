import { Component, EventEmitter, Output } from '@angular/core';
import { FilterPosttypeComponent } from '../filter-posttype/filter-posttype.component';
import { PostService } from '../../post.service';

@Component({
  selector: 'app-homepage-sidebar',
  standalone: true,
  imports: [FilterPosttypeComponent],
  providers: [PostService],
  templateUrl: './homepage-sidebar.component.html',
  styleUrl: './homepage-sidebar.component.css'
})
export class HomepageSidebarComponent {
  message!: string;

  constructor(private postService: PostService) { }

  @Output() columnClicked: EventEmitter<string> = new EventEmitter<string>();

  filterSelected(event: any) {
    this.columnClicked.emit(event);
  }

}
