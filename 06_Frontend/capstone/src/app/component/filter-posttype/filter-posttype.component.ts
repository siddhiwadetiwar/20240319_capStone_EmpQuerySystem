import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter-posttype',
  standalone: true,
  imports: [],
  templateUrl: './filter-posttype.component.html',
  styleUrl: './filter-posttype.component.css'
})
export class FilterPosttypeComponent {
  @Output() columnClicked: EventEmitter<string> = new EventEmitter<string>();

  onColumnClicked(filter: string): void {
    console.log(filter);
    this.columnClicked.emit(filter);
  }
}
