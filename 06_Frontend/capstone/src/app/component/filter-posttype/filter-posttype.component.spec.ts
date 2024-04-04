import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPosttypeComponent } from './filter-posttype.component';

describe('FilterPosttypeComponent', () => {
  let component: FilterPosttypeComponent;
  let fixture: ComponentFixture<FilterPosttypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPosttypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterPosttypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
