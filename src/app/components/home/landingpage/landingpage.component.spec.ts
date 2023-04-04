import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LandingpageComponent } from './landingpage.component';

describe('LandingpageComponent', () => {
  let component: LandingpageComponent;
  let fixture: ComponentFixture<LandingpageComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingpageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login page', () => {
    let myRouter = TestBed.get(Router);
    const navigateSpy = spyOn(myRouter, 'navigate');
    component.onlogin();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to register page', () => {
    let myRouter = TestBed.get(Router);
    const navigateSpy = spyOn(myRouter, 'navigate');
    component.onSignUp();
    expect(navigateSpy).toHaveBeenCalledWith(['/register']);
  });
});
