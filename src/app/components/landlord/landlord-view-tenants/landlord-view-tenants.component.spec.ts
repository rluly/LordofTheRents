import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';
import { FooterComponent } from '../../global/footer/footer.component';
import { LandlordComposeMessageModalComponent } from './landlord-compose-message-modal/landlord-compose-message-modal.component';
import { LandlordViewMessagesModalComponent } from './landlord-view-messages-modal/landlord-view-messages-modal.component';

import { LandlordViewTenantsComponent } from './landlord-view-tenants.component';

describe('LandlordViewTenantsComponent', () => {
  let component: LandlordViewTenantsComponent;
  let fixture: ComponentFixture<LandlordViewTenantsComponent>;

  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

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
      declarations: [LandlordViewTenantsComponent, FooterComponent],
      imports: [
        HttpClientModule,
        MatDialogModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
      ],
      providers: [
        MatDialog,
        {
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
          useValue: { hasBackdrop: false },
        },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: CognitoService, useValue: cognitoServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordViewTenantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('tenants should contain active tenants for the given landlord on load', () => {
    component.ngOnInit();
    expect(component.tenants).toEqual(fakeTenants.filter((x) => x.active));
  });

  it('tenant should be added to selectedTenants when check clicked and tenant not in selectedTenants', () => {
    component.tenants = fakeTenants;
    fixture.detectChanges();

    const checkTenant1 = fixture.debugElement.query(By.css('.check-1'));
    const setRecipients = spyOn(component, 'setRecipients');

    expect(checkTenant1.nativeElement.checked).toBeFalsy();

    checkTenant1.nativeElement.click();

    fixture.detectChanges();

    expect(checkTenant1.nativeElement.checked).toBeTruthy();
    expect(setRecipients).toHaveBeenCalledWith(fakeTenants[0].id);
  });

  it('setRecipients should add tenant if tenant not in selectedTenants', () => {
    component.tenants = fakeTenants;
    component.setRecipients(1);
    expect(component.selectedTenants).toEqual([fakeTenants[0]]);
  });

  it('setRecipients should remove tenant if tenant already in selectedTenants', () => {
    component.selectedTenants = fakeTenants;
    component.setRecipients(1);
    expect(component.selectedTenants).toEqual(
      fakeTenants.filter((x) => x.id !== 1)
    );
  });

  it('should call openDialogViewMessages when view button clicked', () => {
    component.tenants = fakeTenants;

    fixture.detectChanges();

    const viewTenant1 = fixture.debugElement.query(By.css('.view-1'));
    const openDialogViewMessages = spyOn(component, 'openDialogViewMessages');

    viewTenant1.nativeElement.click();

    expect(openDialogViewMessages).toHaveBeenCalledWith(fakeTenants[0]);
  });

  it('openDialogViewMessages should open LandlordViewMessagesModalComponent', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.openDialogViewMessages(fakeTenants[0]);
    expect(component.dialog.open).toHaveBeenCalledWith(
      LandlordViewMessagesModalComponent,
      {
        width: '40em',
        height: 'min(fit-content, 50em)',
        hasBackdrop: true,
      }
    );
  });

  it('openDialogComposeSelected should open LandlordComposeMessageComponent when selectedTenants is not undefined or empty', () => {
    component.selectedTenants = fakeTenants;
    fixture.detectChanges();

    spyOn(component.dialog, 'open').and.callThrough();
    component.openDialogComposeSelected();
    expect(component.dialog.open).toHaveBeenCalledWith(
      LandlordComposeMessageModalComponent,
      {
        width: '40em',
        height: 'min(fit-content, 50em)',
        hasBackdrop: true,
      }
    );
  });

  it('openDialogComposeAll should open LandlordComposeMessageComponent with all tenants', () => {
    component.selectedTenants = fakeTenants;
    fixture.detectChanges();

    spyOn(component.dialog, 'open').and.callThrough();
    component.openDialogComposeAll();
    expect(component.dialog.open).toHaveBeenCalledWith(
      LandlordComposeMessageModalComponent,
      {
        width: '40em',
        height: 'min(fit-content, 50em)',
        hasBackdrop: true,
      }
    );
  });
});
