import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { of } from 'rxjs';
import { Announcement } from 'src/app/models/announcement';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TenantAnnouncementModalComponent } from '../../tenant/tenant-announcement-modal/tenant-announcement-modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { TenantAnnouncementComponent } from './tenant-announcement.component';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';

class dialogMock {
  open() {
    return {
      afterClosed: () => of({}),
    };
  }
}

describe('TenantAnnouncementComponent', () => {
  let component: TenantAnnouncementComponent;
  let fixture: ComponentFixture<TenantAnnouncementComponent>;
  let announcementServiceSpy: jasmine.SpyObj<AnnouncementService>;
  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let viewId: number = 1;
  let fakeAnnouncements = [
    new Announcement(0, 'subject', 'message', 'date', 'time', true, true, true),
    new Announcement(1, 'subject', 'message', 'date', 'time', true, true, true),
  ];
  let dialog: any;
  let fakeLandlordId = 1;

  let fakeTenants = [
    {
      id: 1,
      fk: fakeLandlordId,
      name: 'John',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
    },
    {
      id: 2,
      fk: fakeLandlordId,
      name: 'Tony',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
    },
    {
      id: 3,
      fk: fakeLandlordId,
      name: 'Aaron',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: false,
    },
  ];
  let fakeLandlord = {
    id: 1,
    name: 'Test',
    phoneNumber: '12345',
    email: 'test@gmail.com',
    active: false,
  };

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
          tenants: [],
        },
      };
      return testUser;
    },
  };

  let MockLoginService = {
    getLogginUserInput(email: string) {
      let attributes = {
        email: 'test@gmail.com',
        password: 'Test123!',
        showPassword: true,
        code: '',
        name: 'Test',
        id: fakeLandlordId,
        tenants: fakeTenants,
      };
      return of(attributes);
    },
  };

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'request',
    ]);
    httpClientSpy.get.and.returnValue(of(fakeAnnouncements));
    announcementServiceSpy = jasmine.createSpyObj('AnnouncementService', [
      'getTenantAnnouncements',
      'viewAnnouncement',
      'getLandlordId',
      'getLandlordByTenantId',
    ]);
    announcementServiceSpy.viewAnnouncement;
    announcementServiceSpy.getTenantAnnouncements.and.returnValue(
      of(fakeAnnouncements)
    );
    announcementServiceSpy.getLandlordId.and.returnValue(of(1));
    announcementServiceSpy.getLandlordByTenantId.and.returnValue(
      of(fakeLandlord)
    );
    cognitoServiceSpy = jasmine.createSpyObj('MockCognitoService', [
      'getUserAttributes',
    ]);
    cognitoServiceSpy.getUserAttributes.and.returnValue(
      MockCognitoService.getUserAttributes()
    );

    loginServiceSpy = jasmine.createSpyObj('MockLoginService', [
      'getLogginUserInput',
    ]);
    loginServiceSpy.getLogginUserInput.and.returnValue(
      MockLoginService.getLogginUserInput('test@gmail.com')
    );

    await TestBed.configureTestingModule({
      declarations: [
        TenantAnnouncementComponent,
        TenantAnnouncementModalComponent,
      ],
      imports: [HttpClientModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: new dialogMock() },
        { provide: AnnouncementService, useValue: announcementServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: CognitoService, useValue: cognitoServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
      ],
    })
      .overrideModule(BrowserModule, {
        set: { entryComponents: [TenantAnnouncementModalComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TenantAnnouncementComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user name and id on init', () => {
    component.ngOnInit();
    expect(component.name).toEqual('');
  });

  it('should dispaly an empty table if there is no logged in user', () => {
    const announcements = fixture.nativeElement.querySelectorAll('tr');
    expect(announcements.length).toEqual(0);
  });

  it('getAnnouncemets should call getLandlordAnnouncements and store it in array', () => {
    component.getAnnouncements();
    expect(announcementServiceSpy.getTenantAnnouncements).toHaveBeenCalled();
  });

  it('viewAnnouncement should call the announcement service and change its id', () => {
    component.viewAnnouncement(2);
    expect(announcementServiceSpy.viewAnnouncement).toHaveBeenCalled();
  });

  it('openSpecificDialog should call dialog.open and viewAnnouncement', () => {
    const spy = spyOn(dialog, 'open').and.callThrough();
    component.openSpecificDialog(1);
    fixture.detectChanges();
    expect(announcementServiceSpy.viewAnnouncement).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
