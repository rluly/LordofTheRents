import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CognitoService } from './services/cognito.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let cognitoSpy: jasmine.SpyObj<CognitoService>;
  let routerSpy: jasmine.SpyObj<Router>;
  beforeEach(async () => {
    cognitoSpy = jasmine.createSpyObj('CognitoService', [
      'isAuthenticated',
      'signOut',
    ]);
    cognitoSpy.isAuthenticated.and.returnValue(of(true));
    cognitoSpy.signOut.and.returnValue(Promise.resolve(true));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CognitoService, cognitoSpy },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should check if the user is authenticated when the app is loaded', () => {
    const isAuthenticated: boolean = true;
    cognitoSpy
      .isAuthenticated()
      .subscribe((res) => expect(res).toEqual(isAuthenticated));
  });

  xit('router navigate should be called after signout', async () => {});
});
