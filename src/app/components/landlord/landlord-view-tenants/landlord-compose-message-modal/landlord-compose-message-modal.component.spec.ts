import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Announcement } from 'src/app/models/announcement';
import { AnnouncementService } from 'src/app/services/announcement.service';

import { LandlordComposeMessageModalComponent } from './landlord-compose-message-modal.component';

describe('LandlordComposeMessageModalComponent', () => {
  let fakeLandlordId = 1;

  let fakeTenants = [
    {
      id: 1,
      fk: fakeLandlordId,
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
      sentAnnouncements: [{}],
    },
    {
      id: 2,
      fk: fakeLandlordId,
      firstName: 'Tony',
      lastName: 'Dalton',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
      sentAnnouncements: [{}],
    },
    {
      id: 3,
      fk: fakeLandlordId,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneNumber: '12345',
      email: 'test@gmail.com',
      active: true,
      sentAnnouncements: [{}],
    },
  ];

  let MockAnnouncementService = {
    addAnnouncement(
      subject: string,
      message: string,
      date: string,
      time: string,
      landlordId: number,
      tenantId: number
    ) {
      return of(
        new Announcement(1, subject, message, date, time, true, true, true)
      );
    },
  };

  let MockDialogRef = {
    close: () => {},
  };

  let component: LandlordComposeMessageModalComponent;
  let fixture: ComponentFixture<LandlordComposeMessageModalComponent>;

  let announcementServiceSpy: jasmine.SpyObj<AnnouncementService>;

  beforeEach(async () => {
    announcementServiceSpy = jasmine.createSpyObj('MockAnnouncementService', [
      'addAnnouncement',
    ]);
    announcementServiceSpy.addAnnouncement.and.returnValue(
      MockAnnouncementService.addAnnouncement(
        '',
        '',
        '',
        '',
        fakeLandlordId,
        fakeTenants[0].id
      )
    );

    await TestBed.configureTestingModule({
      declarations: [LandlordComposeMessageModalComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: MockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: AnnouncementService, useValue: MockAnnouncementService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordComposeMessageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('recipients string should be set on load and truncated if length > 30', () => {
    let testRecipients = fakeTenants
      .map((x) => x.firstName + ' ' + x.lastName)
      .join('; ');
    let truncatedRecipients = testRecipients.substring(0, 20) + '...';
    component.selectedTenants = fakeTenants;
    component.ngOnInit();
    expect(component.recipients).toEqual(truncatedRecipients);
  });

  it('recipients input should display recipients and form should not be valid on init', () => {
    let testRecipients = fakeTenants
      .map((x) => x.firstName + ' ' + x.lastName)
      .join('; ');
    let truncatedRecipients = testRecipients.substring(0, 20) + '...';
    component.selectedTenants = fakeTenants;
    component.ngOnInit();

    fixture.detectChanges();

    const recipientsInput = fixture.debugElement.query(By.css('.recipients'));

    expect(recipientsInput.nativeElement.value).toBe(truncatedRecipients);

    expect(component.submitted).toBeFalse();
    expect(component.messageForm.valid).toBeFalse();
  });

  it('send button should call submit', () => {
    const sendButton = fixture.debugElement.query(By.css('.send'));
    const submitSpy = spyOn(component, 'submit');

    sendButton.nativeElement.click();

    expect(submitSpy).toHaveBeenCalled();
  });

  it('display subject error if empty and less than 2 characters on submit', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(
      component.messageForm.controls.subject.errors?.['required']
    ).toBeTrue();
  });

  it('display message error if empty and less than 2 characters on submit', () => {
    component.submit();
    expect(component.submitted).toBeTrue();
    expect(
      component.messageForm.controls.message.errors?.['required']
    ).toBeTrue();
  });

  it('submit should call AnnouncementService addAnnouncement when button clicked and form valid', () => {
    let testRecipients = fakeTenants
      .map((x) => x.firstName + ' ' + x.lastName)
      .join('; ');
    component.selectedTenants = fakeTenants;
    component.ngOnInit();

    const subjectInput = fixture.debugElement.query(By.css('.subject'));
    subjectInput.nativeElement.value = 'Subject';
    subjectInput.nativeElement.dispatchEvent(new Event('input'));

    const messageInput = fixture.debugElement.query(By.css('.message'));
    messageInput.nativeElement.value = 'This is a test message.';
    messageInput.nativeElement.dispatchEvent(new Event('input'));

    component.submit();

    expect(component.submitted).toBeTrue();
    expect(component.messageForm.valid).toBeTrue();
  });

  it('closeDialog should close modal', () => {
    spyOn(component.dialogRef, 'close');
    component.closeDialog();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
