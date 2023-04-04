import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { of } from 'rxjs';

import { TenantSchedulePageComponent } from './tenant-schedule-page.component';
import { LoginService } from 'src/app/services/login.service';
import { Task } from 'src/app/models/task';
import { CognitoService } from 'src/app/services/cognito.service';

describe('TenantSchedulePageComponent', () => {
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

  let component: TenantSchedulePageComponent;
  let fixture: ComponentFixture<TenantSchedulePageComponent>;
  let fakeLanlord = { id: 1, firstName: 'john' };
  let fakeTenant = {
    id: 1,
    firstName: 'arvine',
    lastName: 'rastegar',
    email: 'arvine@uab.edu',
    landlord: fakeLanlord,
  };
  const newDate = Date();
  let fakeTask = new Task(
    'formValue.reason ' + ':' + 'formValue.details',
    'datetime[1]',
    'datetime[0]',
    true
  );

  let fakeLandlordId = 1;
  let fakeTasks = [
    new Task('Task 1', '4:00 PM', '10/10/22', true),
    new Task('Task 2', '3:00 PM', '10/5/22', true),
    new Task('Task 3', '11:00 AM', '10/20/22', false),
  ];
  fakeTasks.map((element, index) => {
    element.id = index + 1;
    element.landlordId = fakeLandlordId;
  });

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
        },
      };
      return testUser;
    },
  };

  let MockLoginService = {
    getLogginUserInput(email: string) {
      return of(MockCognitoService.getUserAttributes());
    },
  };

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getLandlordIdByTenantId',
      'postTask',
    ]);
    taskServiceSpy.getLandlordIdByTenantId.and.returnValue(of(fakeTasks[0]));
    taskServiceSpy.postTask.and.returnValue(of(fakeTasks[0]));

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
      declarations: [TenantSchedulePageComponent],
      imports: [HttpClientModule, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: TaskService, useVal: taskServiceSpy },
        { provide: CognitoService, useValue: cognitoServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantSchedulePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should test reset method to see if form is rest`, () => {
    const spy = spyOn(component.scheduleForm, 'reset');
    component.reset();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it(`should test the removeItem() method to see if  item is really 
        removed from listData `, () => {
    component.listData = ['arvine', 'tester'];
    component.removeItem('arvine');
    fixture.whenStable();
    expect(component.listData).toEqual(['tester']);
    expect(component.listData.length).toEqual(1);
  });

  it(`should test convertDateTime() method to see if it converts dateTime into 
        an array of 2 strings [date, time] PM`, () => {
    const dateTime = '022-10-19T14:00';
    const val = component.convertDateTime(dateTime);
    fixture.whenStable();
    expect(val[0]).toEqual('10/19/2');
    expect(val[1]).toEqual('2:00 PM');
  });

  it(`should test convertDateTime() method to see if it converts dateTime into 
        an array of 2 strings [date, time] AM`, () => {
    const dateTime = '022-10-19T09:00';
    const val = component.convertDateTime(dateTime);
    fixture.whenStable();
    expect(val[0]).toEqual('10/19/2');
    expect(val[1]).toEqual('9:00 AM');
  });

  it(`should test the submit() method`, () => {
    const spy = spyOn(component, 'submit').and.callThrough();

    const form = fixture.nativeElement.querySelector('.reg-form');

    const allInputs = fixture.nativeElement.querySelectorAll('.form-input');

    let reasonTextBox = allInputs[0];
    let dateTextBox = allInputs[1];

    reasonTextBox.value = 'fix my wall';
    reasonTextBox.dispatchEvent(new Event('input'));

    dateTextBox.value = '022-10-19T14:00';
    dateTextBox.dispatchEvent(new Event('input'));

    component.submit();
    expect(spy).toHaveBeenCalled();
  });

  xit('submit() to postTask when valid', async () => {
    component.scheduleForm.controls['reason'].setValue('Some reason');
    component.scheduleForm.controls['date'].setValue('022-10-19T14:00');

    const resetSpy = spyOn(component.scheduleForm, 'reset');

    component.submit();

    await fixture.detectChanges();

    expect(resetSpy).toHaveBeenCalled();
  });
});
