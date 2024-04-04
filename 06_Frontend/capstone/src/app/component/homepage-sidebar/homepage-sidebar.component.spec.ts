import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageSidebarComponent } from './homepage-sidebar.component';

describe('HomepageSidebarComponent', () => {
  let component: HomepageSidebarComponent;
  let fixture: ComponentFixture<HomepageSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomepageSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
