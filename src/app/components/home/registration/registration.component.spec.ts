import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Register } from 'src/app/models/register';
import { CognitoService, IUser } from 'src/app/services/cognito.service';

import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let MockCognitoService = {
    async confirmSignUp(user: any) {
      return Promise.resolve(true);
    },
  };

  const userDummyData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@mail.com',
    password: 'Password1!',
    cPassword: 'Password1!',
  };

  const contactDummyDataTenant = {
    phone: '123456789',
    user: 'tenant',
    policy: 'true',
    landlord: '',
  };

  const contactDummyDataLandlord = {
    phone: '123456789',
    user: 'tenant',
    policy: 'true',
    landlord: '',
  };

  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    cognitoServiceSpy = jasmine.createSpyObj('MockCognitoService', [
      'confirmSignUp',
    ]);

    await TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CognitoService, useValue: cognitoServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid form when empty', () => {
    expect(component.regForm.valid).toBeFalsy();
  });

  it('should be valid form, when Registration form passes all validation', () => {
    const userDummyData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@mail.com',
      password: 'Password1!',
      cPassword: 'Password1!',
    };

    const contactDummyData = {
      phone: '123456789',
      user: 'tenant',
      policy: 'true',
      landlord: '',
    };

    component.regForm.controls.userDetails.patchValue(userDummyData);
    component.regForm.controls.contactDetails.patchValue(contactDummyData);
    fixture.detectChanges();
    expect(component.regForm.valid).toBeTruthy();
  });

  it('should be an Invalid form, when Registration form doesnt pass all validations', () => {
    const userDummyData = {
      firstName: 'J',
      lastName: '',
      email: 'johnmail',
      password: 'Password',
      cPassword: 'Pass',
    };

    const contactDummyData = {
      phone: '1239',
      user: 'john',
      policy: '',
      landlord: '',
    };

    component.regForm.controls.userDetails.patchValue(userDummyData);
    component.regForm.controls.contactDetails.patchValue(contactDummyData);
    fixture.detectChanges();
    expect(component.regForm.valid).toBeFalsy();
  });

  it('should call the submit() method when the form is submitted', () => {
    const el = fixture.debugElement.query(By.css('.reg-form'));
    const func = spyOn(component, 'submit');

    el.triggerEventHandler('ngSubmit', null);

    expect(func).toHaveBeenCalled();
  });

  it('should submit the form when the submit button is clicked', () => {
    const btnEl = fixture.debugElement.query(By.css('.form-input-btn'));
    const func = spyOn(component, 'submit');

    (btnEl.nativeElement as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(func).toHaveBeenCalled();
  });

  it(`should test showPass() to show formPassword be equal to 'text' if formPassword is init to 'password' 
      should show formPassword be equal to 'password' if formPassword is init to 'text' 
  `, async () => {
    component.formPassword = 'password';
    fixture.detectChanges();
    component.showPass();
    expect(component.formPassword).toEqual('text');
    expect(component.passShow).toBeTrue();

    component.formPassword = 'text';
    fixture.detectChanges();
    component.showPass();
    expect(component.formPassword).toEqual('password');
    expect(component.passShow).toBeFalse();
  });

  it(`should test showcPass() to show formcPassword be equal to 'text' if formcPassword is init to 'password' 
      should show formcPassword be equal to 'password' if formcPassword is init to 'text' 
  `, async () => {
    component.formcPassword = 'password';
    fixture.detectChanges();
    component.showcPass();
    expect(component.formcPassword).toEqual('text');
    expect(component.cpassShow).toBeTrue();

    component.formcPassword = 'text';
    fixture.detectChanges();
    component.showcPass();
    expect(component.formcPassword).toEqual('password');
    expect(component.cpassShow).toBeFalse();
  });

  it(`should test showDropDown() to see if input == 'tenantDrop' then 
      formTenant = true and formLandlord = false`, async () => {
    component.showDropDown('tenantDrop');
    fixture.detectChanges();
    expect(component.formTenant).toBeTrue();
    expect(component.formLandlord).toBeFalse();
  });

  it(`should test showDropDown() to see if input == 'hide' then 
      formTenant = false and formLandlord = true`, async () => {
    component.showDropDown('hide');
    fixture.detectChanges();
    expect(component.formTenant).toBeFalse();
    expect(component.formLandlord).toBeTrue();
  });

  it(`should test submit() the form`, async () => {
    component.submitted = false;
    fixture.detectChanges();
    component.submit();
    expect(component.submitted).toBe(true);
  });

  it(`should test previous(), step should subtract 1`, async () => {
    component.step = 2;
    fixture.detectChanges();
    component.previous();
    expect(component.step).toBe(1);
  });

  it(`should test the getter methods`, () => {
    const spyFirstName = spyOn<RegistrationComponent, any>(
      component,
      'firstName'
    ).and.returnValue('arvine');
    const spyLastName = spyOn<RegistrationComponent, any>(
      component,
      'lastName'
    ).and.returnValue('rastegar');
    const spyEmail = spyOn<RegistrationComponent, any>(
      component,
      'email'
    ).and.returnValue('arvine@uab.edu');
    const spyPassword = spyOn<RegistrationComponent, any>(
      component,
      'password'
    ).and.returnValue('arvine1234');
    const spyPhone = spyOn<RegistrationComponent, any>(
      component,
      'phone'
    ).and.returnValue('123456');
    const spyLandlord = spyOn<RegistrationComponent, any>(
      component,
      'landlord'
    ).and.returnValue('');
    const spyPrepare = spyOn(component, 'prepareSave').and.returnValue(
      new Register(
        null,
        String(spyFirstName),
        String(spyLastName),
        String(spyEmail),
        String(spyPassword),
        Number(spyPhone),
        Number(spyLandlord)
      )
    );

    component.prepareSave();
    expect(spyPrepare).toHaveBeenCalled();
  });

  it('submit() should return when userDetails invalid and step == 1', () => {
    const logSpy = spyOn(console, 'log');
    component.step = 1;
    component.submit();
    expect(logSpy).toHaveBeenCalledWith('userDetails invalid and step is 1');
  });

  it('submit() should return when contactDetails invalid and step == 2', () => {
    const logSpy = spyOn(console, 'log');
    component.step = 2;
    component.submit();
    expect(logSpy).toHaveBeenCalledWith('contactDetails invalid and step is 2');
  });

  it('submit() should increment step', () => {
    component.regForm.controls.userDetails.patchValue(userDummyData);
    component.regForm.controls.contactDetails.patchValue(
      contactDummyDataTenant
    );
    component.step = 1;
    component.submit();
    expect(component.step).toEqual(2);
  });

  it('submit() should confirm and signUp user when form valid and step == 3', () => {
    component.regForm.controls.userDetails.patchValue(userDummyData);
    component.regForm.controls.contactDetails.patchValue(
      contactDummyDataTenant
    );
    component.step = 3;
    component.submit();
    expect(component.regForm.valid).toBeTrue();
  });

  xit('confirmSignUp() should POST landlord when form valid and user type is landlord', () => {
    cognitoServiceSpy.confirmSignUp.and.returnValue(
      MockCognitoService.confirmSignUp({ email: 'test@gmail.com', code: '' })
    );
    component.regForm.controls.userDetails.patchValue(userDummyData);
    component.regForm.controls.contactDetails.patchValue(
      contactDummyDataLandlord
    );
    component.confirmSignUp();
  });
});
