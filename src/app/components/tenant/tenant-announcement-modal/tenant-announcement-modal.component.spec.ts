import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { of } from 'rxjs';
import { Announcement } from 'src/app/models/announcement';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { TenantAnnouncementModalComponent } from './tenant-announcement-modal.component';

describe('TenantAnnouncementModalComponent', () => {
  let component: TenantAnnouncementModalComponent;
  let fixture: ComponentFixture<TenantAnnouncementModalComponent>;
  let announcementServiceSpy: jasmine.SpyObj<AnnouncementService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let dialogSpy: jasmine.SpyObj<MatDialogRef<TenantAnnouncementModalComponent>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let router: Router;
  let viewId: number = 1;
  let receiveBuffer: ArrayBuffer;
  let postAnnouncement: Announcement = new Announcement(
    6,
    'subject',
    'string',
    'date',
    'time',
    true,
    true,
    true
  );

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['request']);
    announcementServiceSpy = jasmine.createSpyObj('AnnouncementService', [
      'deleteTenantAnnouncement',
      'deleteLandlordAnnouncement',
      'getAnnouncementById',
    ]);
    announcementServiceSpy.deleteLandlordAnnouncement.and.returnValue(
      of(receiveBuffer)
    );
    announcementServiceSpy.deleteTenantAnnouncement.and.returnValue(
      of(receiveBuffer)
    );
    announcementServiceSpy.getAnnouncementById.and.returnValue(
      of(postAnnouncement)
    );
    dialogSpy = jasmine.createSpyObj(
      'MatDialogRef<TenantAnnouncementModalComponent>',
      ['close']
    );
    // dialogSpy.close;
    routerSpy = jasmine.createSpyObj('Router', [
      'parseUrl',
      'currentUrlTree',
      'navigate',
    ]);
    await TestBed.configureTestingModule({
      declarations: [TenantAnnouncementModalComponent],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AnnouncementService, useValue: announcementServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantAnnouncementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if user is a landlord, should set landlord visibility to false', () => {
    // @ts-ignore: force this private property value for testing.
    routerSpy.url = '/landlord/announcements';
    expect(routerSpy.url).toEqual('/landlord/announcements');
    component.deleteAnnouncement();
    expect(
      announcementServiceSpy.deleteLandlordAnnouncement
    ).toHaveBeenCalled();
  });

  it('if a user is a tenant, should set tenant visibility to false', () => {
    // @ts-ignore: force this private property value for testing.
    routerSpy.url = '/tenant/announcements';
    expect(routerSpy.url).toEqual('/tenant/announcements');
    component.deleteAnnouncement();
    expect(announcementServiceSpy.deleteTenantAnnouncement).toHaveBeenCalled();
  });

  it('closeDialog should call dialogRef.close', () => {
    component.closeDialog();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  xit('should close dialog on navigation', () => {
    routerSpy.events?.forEach((event: any) => {
      if (event instanceof NavigationStart) component.closeDialog();
    });
    routerSpy.navigate(['home']);
    fixture.detectChanges();
    expect(dialogSpy.close).toHaveBeenCalled();
  });
});
