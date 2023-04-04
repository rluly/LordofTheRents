import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AnnouncementService } from 'src/app/services/announcement.service';

import { LandlordViewMessagesModalComponent } from './landlord-view-messages-modal.component';

describe('LandlordViewMessagesModalComponent', () => {
  let fakeLandlordId = 1;

  let fakeTenants = [
    {
      id: 1,
      fk: fakeLandlordId,
      name: 'John',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
      sentAnnouncements: [{}],
    },
    {
      id: 2,
      fk: fakeLandlordId,
      name: 'Tony',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
      sentAnnouncements: [{}],
    },
    {
      id: 3,
      fk: fakeLandlordId,
      name: 'Aaron',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: false,
      sentAnnouncements: [{}],
    },
  ];

  let sentAnnouncements = [
    {
      id: 1,
      subject: 'Test',
      message: 'Some message is inputted here.',
      shortMessage: '',
      isShort: false,
      date: '10/5/22',
      time: '4:22 PM',
      landlordIsActive: true,
    },
    {
      id: 2,
      subject: 'Test',
      message: 'Some message is inputted here.',
      shortMessage: 'Some message is inpu',
      isShort: true,
      date: '10/10/22',
      time: '1:10 PM',
      landlordIsActive: true,
    },
  ];

  fakeTenants[0].sentAnnouncements = sentAnnouncements;

  let MockAnnouncementService = {
    getTenantById(tenantId: number) {
      return of(fakeTenants[0]);
    },
  };

  let MockDialogRef = {
    close: () => {},
  };

  let component: LandlordViewMessagesModalComponent;
  let fixture: ComponentFixture<LandlordViewMessagesModalComponent>;

  let announcementServiceSpy: jasmine.SpyObj<AnnouncementService>;

  beforeEach(async () => {
    announcementServiceSpy = jasmine.createSpyObj('MockAnnouncementService', [
      'getTenantById',
    ]);
    announcementServiceSpy.getTenantById.and.returnValue(
      MockAnnouncementService.getTenantById(1)
    );

    await TestBed.configureTestingModule({
      declarations: [LandlordViewMessagesModalComponent],
      imports: [HttpClientModule, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: MockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AnnouncementService, useValue: announcementServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordViewMessagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allAnnouncements should be set for given tenant on load', () => {
    component.tenant = fakeTenants[0];
    component.ngOnInit();
    component.allAnnouncements.reverse();
    expect(component.allAnnouncements).toEqual(
      fakeTenants[0].sentAnnouncements
    );
  });

  it('ngAfterContentInit should set allAnnouncements to short', () => {
    component.tenant = fakeTenants[0];
    component.ngOnInit();
    component.ngAfterContentInit();
    component.allAnnouncements.reverse();
    fixture.detectChanges();
    expect(component.allAnnouncements[0].shortMessage).toEqual('');
  });

  it('toggleFullMessage should be called when "..." clicked for given message', () => {
    component.allAnnouncements = fakeTenants[0].sentAnnouncements;

    fixture.detectChanges();

    const toggleFullMessageSpan = fixture.debugElement.query(
      By.css('.toggle-1')
    );
    const toggleFullMessageSpy = spyOn(component, 'toggleFullMessage');

    (toggleFullMessageSpan.nativeElement as HTMLButtonElement).click();

    expect(toggleFullMessageSpy).toHaveBeenCalled();
  });

  it('toggleFullMessage should set isShort as inverse boolean value', () => {
    component.allAnnouncements = fakeTenants[0].sentAnnouncements;
    fixture.detectChanges();
    component.toggleFullMessage(0);
    expect(component.allAnnouncements[0].isShort).toBeTrue();
  });

  it('closeDialog to be called when exit button clicked', () => {
    const exitButton = fixture.debugElement.query(By.css('.exit'));
    const closeDialogSpy = spyOn(component, 'closeDialog');

    exitButton.nativeElement.click();

    expect(closeDialogSpy).toHaveBeenCalled();
  });

  it('closeDialog should close modal', () => {
    spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
