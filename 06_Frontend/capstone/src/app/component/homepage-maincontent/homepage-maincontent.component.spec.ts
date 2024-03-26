import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageMaincontentComponent } from './homepage-maincontent.component';

describe('HomepageMaincontentComponent', () => {
  let component: HomepageMaincontentComponent;
  let fixture: ComponentFixture<HomepageMaincontentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageMaincontentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomepageMaincontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
