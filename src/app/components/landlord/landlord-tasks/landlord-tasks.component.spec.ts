import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Task } from 'src/app/models/task';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';
import { TaskService } from 'src/app/services/task.service';
import { FooterComponent } from '../../global/footer/footer.component';

import { LandlordTasksComponent } from './landlord-tasks.component';

describe('LandlordTasksComponent', () => {
  let component: LandlordTasksComponent;
  let fixture: ComponentFixture<LandlordTasksComponent>;

  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let cognitoServiceSpy: jasmine.SpyObj<CognitoService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

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
      'getAllActiveTasks',
      'deleteTask',
    ]);
    taskServiceSpy.getAllActiveTasks.and.returnValue(
      of(fakeTasks.filter((x) => x.active))
    );
    taskServiceSpy.deleteTask.and.returnValue(of(fakeTasks[0]));

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
      declarations: [LandlordTasksComponent, FooterComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: CognitoService, useValue: cognitoServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('local tasks should be set on init', async () => {
    component.ngOnInit();
    await fixture.detectChanges();
    expect(component.tasks).toBeTruthy();
  });

  xit('local tasks should be the same as getAllActiveTasks for the given landlord', async () => {
    await taskServiceSpy
      .getAllActiveTasks(fakeLandlordId)
      .subscribe((response) =>
        expect(response).toEqual(
          fakeTasks.filter((x) => x.active) ||
            fakeTasks.sort(
              (a: any, b: any) => a.datetime.getTime() - b.datetime.getTime()
            )
        )
      );
  });

  it('tasks should have a correct datetime attribute', () => {
    component.tasks = fakeTasks;
    component.sortTasks();
    fixture.detectChanges();
    expect(
      component.tasks[0].datetime.toLocaleString('en-US', { timeZone: 'CST' })
    ).toEqual(
      new Date(2022, 10, 5, 15, 0).toLocaleString('en-US', { timeZone: 'CST' })
    );
    expect(
      component.tasks[1].datetime.toLocaleString('en-US', { timeZone: 'CST' })
    ).toEqual(
      new Date(2022, 10, 10, 16, 0).toLocaleString('en-US', { timeZone: 'CST' })
    );
  });

  it('tasks should be sort by datetime in descending order', () => {
    component.tasks = fakeTasks;
    component.sortTasks();
    fixture.detectChanges();
    expect(component.tasks[0].task).toEqual('Task 2');
    expect(component.tasks[1].task).toEqual('Task 1');
  });

  it('should convert PM time to military time', () => {
    component.tasks = fakeTasks;
    component.sortTasks();
    fixture.detectChanges();
    expect(component.tasks[0].datetime.getHours()).toEqual(15);
    expect(component.tasks[1].datetime.getHours()).toEqual(16);
  });

  it('should leave AM time as is', () => {
    component.tasks = fakeTasks;
    component.sortTasks();
    fixture.detectChanges();
    expect(component.tasks[2].datetime.getHours()).toEqual(11);
  });

  it('should display message when no tasks exist', () => {
    component.tasks = [];
    fixture.detectChanges();
    let message = fixture.nativeElement.querySelectorAll('h4');
    expect(message[0].textContent).toEqual('You have no current tasks');
  });

  it('deleteTask should call TaskService deleteTask and return null', () => {
    taskServiceSpy
      .deleteTask(fakeTasks[0])
      .subscribe((response) => expect(response).toEqual(fakeTasks[0]));
  });

  it('delete button should call TaskService delete with given task as argument', () => {
    component.tasks = fakeTasks;
    component.sortTasks();

    fixture.detectChanges();

    const buttonTask2 = fixture.debugElement.query(By.css('.delete-2'));
    const deleteTask = spyOn(component, 'deleteTask');

    (buttonTask2.nativeElement as HTMLButtonElement).click();

    fixture.detectChanges();

    expect(deleteTask).toHaveBeenCalledWith(fakeTasks[0]);
    expect(component.tasks[0]).toEqual(fakeTasks[0]);
  });
});
