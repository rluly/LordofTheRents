import { TestBed } from '@angular/core/testing';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Announcement } from '../models/announcement';
import { of, throwError } from 'rxjs';

import { AnnouncementService } from './announcement.service';
import { Tenant } from '../models/tenant';
import { environment } from '../../environments/environment.prod';

describe('AnnouncementService', () => {
  let service: AnnouncementService;
  let baseURL: string = environment.baseURL;
  let fakeAnnouncements = [
    new Announcement(0, 'subject', 'message', 'date', 'time', true, true, true),
    new Announcement(1, 'subject', 'message', 'date', 'time', true, true, true),
  ];
  let postedAnnouncement = new Announcement(
    2,
    'subject',
    'message',
    'date',
    'time',
    true,
    true,
    true
  );
  let postedTenant = new Tenant(6, 6, 'name', '123456789', 'someone@someplace');
  let addedAnnouncement = {
    subject: 'subject',
    message: 'message',
    date: 'date',
    time: 'time',
    landlordId: 1,
    tenantId: 1,
  };
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let viewId: number = 0;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'request',
    ]);
    httpClientSpy.get.and.returnValue(of(fakeAnnouncements));
    httpClientSpy.post.and.returnValue(of(addedAnnouncement));
    httpClientSpy.put.and.returnValue(of(addedAnnouncement));
    httpClientSpy.request.and.returnValue(of(postedAnnouncement));
    viewId = 0;
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(AnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set viewId to 1', () => {
    service.viewAnnouncement(1);
    expect(service.viewId).toBe(1);
  });

  it('getLandlordAnnouncements should make an http GET request to correct url', () => {
    //AAA - Arrange, Act, Assert
    //SEAT - Setup Exercise Assert Teardown

    //Act
    service.getLandlordAnnouncements(1).subscribe(
      //Assert
      (res) => expect(res).toEqual(fakeAnnouncements)
    );
    let param = '?id=1';
    //Assert
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      baseURL + 'sentAnnouncements/allActiveLandlords' + param
    );
  });

  it('getTenantAnnouncements should make an http GET request to correct url', () => {
    //AAA - Arrange, Act, Assert
    //SEAT - Setup Exercise Assert Teardown

    //Act
    service.getTenantAnnouncements(1).subscribe(
      //Assert
      (res) => expect(res).toEqual(fakeAnnouncements)
    );
    let param = '?id=1';
    //Assert
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      baseURL + 'sentAnnouncements/allActiveTenants' + param
    );
  });

  it('addAnnouncement should make POST call to correct url with passed announcement', () => {
    service
      .addAnnouncement('subject', 'message', 'date', 'time', 1, 1)
      .subscribe((res) =>
        expect(res.subject).toEqual(addedAnnouncement.subject)
      );
    let param = '?landlordId=1&tenantId=1';
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      baseURL + 'sentAnnouncements/add' + param,
      { subject: 'subject', message: 'message', date: 'date', time: 'time' },
      jasmine.any(Object)
    );
  });

  it('getAnnouncementById should search the local announcements array if it has announcements and return the correct announcement', () => {
    service.getLandlordAnnouncements(1).subscribe(() => {
      service
        .getAnnouncementById()
        .subscribe((res) => expect(res).toEqual(fakeAnnouncements[0]));
    });
  });

  it('should get appropriate tenant based off ID', () => {
    httpClientSpy.get.and.returnValue(of(postedTenant));
    service
      .getTenantById(6)
      .subscribe((res) => expect(res.name).toEqual(postedTenant.name));
    expect(httpClientSpy.get).toHaveBeenCalledWith(baseURL + 'tenants/6');
  });

  it('deleteLandlordAnnouncement should make a DELETE request to the correct URL ', () => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        lazyInit: jasmine.anything as any,
      }),
      body: postedAnnouncement,
    };
    service
      .deleteLandlordAnnouncement(postedAnnouncement)
      .subscribe(() =>
        expect(httpClientSpy.request).toHaveBeenCalledWith(
          'delete',
          baseURL + 'sentAnnouncements/deactivateLandlord',
          jasmine.any(Object)
        )
      );
  });

  it('deleteTenantAnnouncement should make a DELETE request to the correct URL ', () => {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        lazyInit: jasmine.anything as any,
      }),
      body: postedAnnouncement,
    };
    service
      .deleteTenantAnnouncement(postedAnnouncement)
      .subscribe(() =>
        expect(httpClientSpy.request).toHaveBeenCalledWith(
          'delete',
          baseURL + 'sentAnnouncements/deactivateTenant',
          jasmine.any(Object)
        )
      );
  });

  it('should handle 0 series error from http requests using the handleErrors function', (done: DoneFn) => {
    const errorResponse0 = new HttpErrorResponse({
      error: 'test 0 status error',
      status: 0,
      statusText: '0 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse0));

    service.getLandlordAnnouncements(1).subscribe({
      next: (announcement) => done.fail('expected an error'),
      error: (error) => {
        expect(error.message).toEqual(
          'Something bad happened; please try again later.'
        );
        done();
      },
    });
  });

  it('should handle non-0 series error from http requests using the handleErrors function', (done: DoneFn) => {
    const errorResponse200 = new HttpErrorResponse({
      error: 'test non-0 status error',
      status: 200,
      statusText: 'non-0 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse200));

    service.getLandlordAnnouncements(1).subscribe({
      next: (announcement) => done.fail('expected an error'),
      error: (error) => {
        expect(error.message).toEqual(
          'Something bad happened; please try again later.'
        );
        done();
      },
    });
  });
});
