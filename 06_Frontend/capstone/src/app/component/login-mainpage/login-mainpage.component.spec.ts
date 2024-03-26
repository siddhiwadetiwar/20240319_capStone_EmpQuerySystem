import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginMainpageComponent } from './login-mainpage.component';

describe('LoginMainpageComponent', () => {
  let component: LoginMainpageComponent;
  let fixture: ComponentFixture<LoginMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginMainpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
