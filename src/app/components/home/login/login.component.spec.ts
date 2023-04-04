import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { CognitoService, IUser } from 'src/app/services/cognito.service';

import { LoginComponent } from './login.component';
import { LoggedInUserService } from 'src/app/services/logged-in-user.service';

describe('LoginComponent', () => {
  let testLandlord = {
    email: 'landlord@gmail.com',
    password: 'Test123!',
    showPassword: true,
    code: '',
    name: 'Test',
    tenants: [],
  };

  let testTenant = {
    email: 'tenant@gmail.com',
    password: 'Test123!',
    showPassword: true,
    code: '',
    name: 'Test',
  };

  let testUsers = [testLandlord, testTenant];

  let MockLoginService = {
    getLogginUserUserInput(email: string) {
      let user = testUsers.filter((x) => x.email === email)[0];
      return of(user);
    },
    navigateRegister() {
      return;
    },
  };

  let MockLoggedInUserService = {
    setUser(user: any) {
      return of(true);
    },
  };

  let MockCognitoService = {
    signIn(user: any) {
      return Promise.resolve(true);
    },
  };

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let loggedInUserSpy: jasmine.SpyObj<LoggedInUserService>;
  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    loginServiceSpy = jasmine.createSpyObj('MockLoginService', [
      'getLogginUserInput',
      'navigateRegister',
    ]);

    loggedInUserSpy = jasmine.createSpyObj('MockLoggedInUserService', [
      'setUser',
    ]);

    cognitoServiceSpy = jasmine.createSpyObj('MockCognitoServiceSpy', [
      'signIn',
    ]);
    cognitoServiceSpy.signIn.and.returnValue(Promise.resolve(true));

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: LoggedInUserService, useValue: loggedInUserSpy },
        { provide: CognitoService, useValue: cognitoServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('findUser should call LoginService and navigate user to landlord landing page when user is landlord', () => {
    component.email = 'landlord@gmail.com';
    loginServiceSpy.getLogginUserInput.and.returnValue(
      MockLoginService.getLogginUserUserInput(component.email)
    );
    component.findUser();
    expect(component.user).toEqual(testUsers[0]);
    expect(loggedInUserSpy.setUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landlord']);
  });

  it('findUser should call LoginService and navigate user to tenant landing page when user is tenant (no tenants property)', () => {
    component.email = 'tenant@gmail.com';
    loginServiceSpy.getLogginUserInput.and.returnValue(
      MockLoginService.getLogginUserUserInput(component.email)
    );
    component.findUser();
    expect(component.user).toEqual(testUsers[1]);
    expect(loggedInUserSpy.setUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tenant']);
  });

  it('loginEvent should sign user in using CognitoService', async () => {
    const findUserSpy = spyOn(component, 'findUser');

    component.user = {} as IUser;
    component.email = 'test@gmail.com';
    component.password = 'password';
    component.loginEvent();

    await fixture.detectChanges();

    expect(findUserSpy).toHaveBeenCalled();
  });

  it('loginEvent should catch error if CognitoService does not recognize user', async () => {
    cognitoServiceSpy.signIn.and.returnValue(Promise.reject(true));
    component.loginEvent();
    await fixture.detectChanges();
    expect(component.user).toEqual({ email: '', password: '' } as IUser);
  });

  it('signUpEvent should call LoginService navigateRegister', () => {
    component.signupEvent();
    expect(loginServiceSpy.navigateRegister).toHaveBeenCalled();
  });
});
