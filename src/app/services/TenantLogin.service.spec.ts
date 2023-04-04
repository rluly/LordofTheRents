import { TestBed } from '@angular/core/testing';
import { TenantLogin } from './TenantLogin.service';
import { CognitoService } from './cognito.service';
import { LoginService } from './login.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('TenantLoginService', () => {
  let fakeLandlordId = 1;

  let MockCognitoService = {
    async getUserAttributes() {
      let testUser: any = {
        attributes: {
          email: 'test@gmail.com',
          password: 'Test123!',
          showPassword: true,
          code: '',
          name: 'Test',
          id: fakeLandlordId,
        },
      };
      return testUser;
    },
  };

  let MockLoginService = {
    getLogginUserInput(email: string) {
      return of(MockCognitoService.getUserAttributes());
    },
  };

  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let service: TenantLogin;

  beforeEach(() => {
    cognitoServiceSpy = jasmine.createSpyObj('MockCognitoService', [
      'getUserAttributes',
    ]);
    cognitoServiceSpy.getUserAttributes.and.returnValue(
      MockCognitoService.getUserAttributes()
    );

    loginServiceSpy = jasmine.createSpyObj('MockLoginService', [
      'getLogginUserInput',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CognitoService, useValue: cognitoServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
    service = TestBed.inject(TenantLogin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`canActivate() should allow logged in Tenant to navigate to tenant pages`, () => {
    loginServiceSpy.getLogginUserInput.and.returnValue(
      of({ email: 'test@gmail.com' })
    );
    service.canActivate().subscribe((res) => {
      expect(res).toBeTrue();
    });
  });

  it(`canActivate() should NOT allow logged in Landlord to navigate to tenant pages`, () => {
    loginServiceSpy.getLogginUserInput.and.returnValue(
      of({ email: 'test@gmail.com', tenants: [] })
    );
    service.canActivate().subscribe((res) => {
      expect(res).toBeFalse();
    });
  });

  it('canActivate() should NOT allow non-logged-in user to navigate any other than home/landing page', () => {
    cognitoServiceSpy.getUserAttributes.and.callFake(() =>
      Promise.reject('test error')
    );
    service.canActivate();
    setTimeout(() => {
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });
  });
});
