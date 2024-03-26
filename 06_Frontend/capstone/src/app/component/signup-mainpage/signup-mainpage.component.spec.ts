import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupMainpageComponent } from './signup-mainpage.component';

describe('SignupMainpageComponent', () => {
  let component: SignupMainpageComponent;
  let fixture: ComponentFixture<SignupMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupMainpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignupMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
