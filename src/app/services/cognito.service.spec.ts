import { TestBed } from '@angular/core/testing';
import { Amplify } from 'aws-amplify';

import { CognitoService, IUser } from './cognito.service';

describe('CognitoService', () => {
  let service: CognitoService;
  let routerSpy: jasmine.SpyObj<any>;
  let fakeUser = {
    attributes: {
      email: 'test1@test.com',
      password: 'qwer!Q@W123',
      code: 'qwer!Q@W123',
    } as IUser,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated, should broadcast true, if user is returned', (done: DoneFn) => {
    let isAuthenticated: boolean;
    spyOn(Amplify.Auth, 'currentUserInfo').and.returnValue(
      Promise.resolve(fakeUser)
    );
    service.isAuthenticated().subscribe((res) => (isAuthenticated = res));

    setTimeout(() => {
      expect(isAuthenticated).toBeTruthy();
    });
    done();
  });

  it(`should return canActivate false if no user is logged in`, (done: DoneFn) => {
    let isActivated: boolean = true;
    const spy = spyOn(Amplify.Auth, 'currentUserInfo').and.returnValue(
      Promise.resolve(false)
    );
    service.canActivate().subscribe((res) => (isActivated = res));
    setTimeout(() => {
      expect(isActivated).toBeFalse();
      expect(spy).toHaveBeenCalled();
    });
    done();
  });

  it(`should call signIn() and then Auth.signIn with passed in user info`, (done: DoneFn) => {
    const spy = spyOn(Amplify.Auth, 'signIn').and.returnValue(
      Promise.resolve(true)
    );
    service.signIn(fakeUser.attributes).then(() =>
      expect(spy).toHaveBeenCalledWith({
        username: fakeUser.attributes.email,
        password: fakeUser.attributes.password,
      })
    );
    done();
  });

  it('should call getUser() currentUserInfo and return a user', async () => {
    spyOn(Amplify.Auth, 'currentUserInfo').and.returnValue(
      Promise.resolve(fakeUser)
    );
    service.getUser().then((user) => expect(user).toEqual(fakeUser));
  });
});
