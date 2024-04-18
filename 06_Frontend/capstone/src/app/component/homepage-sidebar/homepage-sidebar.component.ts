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
  // Constructor to inject the PostService into this component
  constructor(private postService: PostService) { }

  // EventEmitter for emitting an event when a column is clicked 
  @Output() columnClicked: EventEmitter<string> = new EventEmitter<string>();

  // Method triggered when a filter is selected; emits the selected event to the parent component
  filterSelected(event: any) {
    this.columnClicked.emit(event);
  }

}
