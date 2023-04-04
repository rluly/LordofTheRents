import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { catchError, map, of, throwError } from 'rxjs';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientTestingModule', ['get']);
    httpClientSpy.get.and.returnValue(of(true));

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getLandlordIdByTenantId() should make http request GET with correct URL', () => {
    httpClientSpy.get.and.returnValue(of(1));
    service.getLandlordIdByTenantId(1).subscribe((response) => {
      expect(response).toEqual(1);
    });
  });

  it('getLandlordById() should make http request GET with correct URL', () => {
    let fakeLandlord = {
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@gmail.com',
    };
    httpClientSpy.get.and.returnValue(of(fakeLandlord));
    service.getLandlordById(1).subscribe((response) => {
      expect(response).toEqual(fakeLandlord);
    });
  });

  it('should handle 0 series error from http requests using the handleErrors function', () => {
    const errorResponse0 = new HttpErrorResponse({
      error: 'test 0 status error',
      status: 0,
      statusText: '0 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse0));

    const errorSpy = spyOn(console, 'error');

    service
      .getLogginUserInput('test@gmail.com')
      .pipe(
        map((res) => console.log(res)),
        catchError((err) => {
          return service.handleError(err);
        })
      )
      .subscribe((res) => {
        expect(errorSpy).toHaveBeenCalled();
      });
  });

  it('handleError() should console.error("An error occurred:", error) when error status is 0', () => {
    const errorResponse0 = new HttpErrorResponse({
      error: 'test 0 status error',
      status: 0,
      statusText: '0 Error',
    });
    const errorSpy = spyOn(console, 'error');
    service.handleError(errorResponse0);
    expect(errorSpy).toHaveBeenCalledWith(
      'An error occurred:',
      errorResponse0.error
    );
  });

  xit('should handle non-0 series error from http requests using the handleErrors function', (done: DoneFn) => {
    const errorResponse200 = new HttpErrorResponse({
      error: 'test non-0 status error',
      status: 200,
      statusText: 'non-0 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse200));

    service.getLogginUserInput('test@gmail.com').subscribe({
      next: (res) => done.fail('expected an error'),
      error: (error) => {
        expect(error.message).toEqual(
          'Something bad happened; please try again later.'
        );
        done();
      },
    });
  });

  it('alert "not a user" on non-0 series error', () => {
    const errorResponse200 = new HttpErrorResponse({
      error: 'test non-0 status error',
      status: 200,
      statusText: 'non-0 Error',
    });
    const windowSpy = spyOn(window, 'alert');
    service.handleError(errorResponse200);

    expect(window.alert).toHaveBeenCalledWith('not a user');
  });

  it('navigateRegister should redirect/route to /register', () => {
    service.navigateRegister();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
  });
});
