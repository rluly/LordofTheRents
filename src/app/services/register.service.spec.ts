import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RegisterService } from './register.service';
import { Register } from '../models/register';
import { environment } from '../../environments/environment.prod';

describe('RegisterService', () => {
  let service: RegisterService;
  let baseURL: string = environment.baseURL;

  let fakeUser: Register[] = [
    new Register(
      '1',
      'Test',
      'Landlord',
      'Test@Landlord.com',
      'Thisisapassword',
      123456789,
      null
    ),
    new Register(
      '2',
      'Test',
      'Tenant',
      'Test@Tenant.com',
      'Thisisapassword',
      789456123,
      1
    ),
  ];

  let fakePostedLandlord = new Register(
    '1',
    'Test',
    'Landlord',
    'Test@Landlord.com',
    'Thisisapassword',
    123456789,
    null
  );

  let fakePostedTenant = new Register(
    '2',
    'Test',
    'Tenant',
    'Test@Tenant.com',
    'Thisisapassword',
    789456123,
    1
  );
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    httpClientSpy.get.and.returnValue(of(fakeUser));

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(RegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllLandlords should make an http GET request to correct url', () => {
    //AAA - Arrange, Act, Assert
    //SEAT - Setup Exercise Assert Teardown

    //Act
    service.getAllLandlords().subscribe(
      //Assert
      (res) => expect<any>(res).toEqual(fakeUser)
    );
    //Assert
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      baseURL + 'landlords/allActive'
    );
  });

  it('postRegisterLandlord should make POST call to correct url with passed Landlord user', () => {
    httpClientSpy.post.and.returnValue(of(fakePostedLandlord));
    httpClientSpy.put.and.returnValue(of(fakePostedLandlord));
    service
      .postRegisterLandlord(fakeUser[0])
      .subscribe((res) => expect(res).toEqual(fakePostedLandlord));

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      baseURL + 'landlords/add',
      fakeUser[0],
      jasmine.any(Object)
    );
  });

  it('postRegisterTenant should make POST call to correct url with passed Tenant user', () => {
    httpClientSpy.post.and.returnValue(of(fakePostedTenant));
    httpClientSpy.put.and.returnValue(of(fakePostedTenant));
    service
      .postRegisterTenant(fakeUser[1])
      .subscribe((res) => expect(res).toEqual(fakePostedTenant));

    expect(httpClientSpy.post).toHaveBeenCalledWith(
      baseURL + 'tenants/add?id=1',
      fakeUser[1],
      jasmine.any(Object)
    );
  });

  it('should handle 0 series error from http requests using the handleErrors function', (done: DoneFn) => {
    const errorResponse0 = new HttpErrorResponse({
      error: 'test 0 status error',
      status: 0,
      statusText: '0 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse0));

    service.getAllLandlords().subscribe({
      next: () => done.fail('expected an error'),
      error: (error) => {
        expect(error.message).toEqual(
          'Something bad happened; please try again later.'
        );
        done();
      },
    });
  });

  it('should handle 400 series error from http requests using the handleErrors function', (done: DoneFn) => {
    const errorResponse400 = new HttpErrorResponse({
      error: 'test 400 status error',
      status: 400,
      statusText: '400 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse400));

    service.getAllLandlords().subscribe({
      next: () => done.fail('expected an error'),
      error: (error) => {
        expect(error.message).toEqual(
          'Something bad happened; please try again later.'
        );
        done();
      },
    });
  });
});
