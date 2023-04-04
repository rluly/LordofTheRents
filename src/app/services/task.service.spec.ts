import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { Task } from '../models/task';

import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let baseURL: string = environment.baseURL;
  let fakeLandlordId = 0;

  let fakeTasks = [
    new Task('Task 1', '4:00 PM', '10/10/22', true),
    new Task('Task 2', '3:00 PM', '10/5/22', true),
    new Task('Task 3', '11:00 AM', '10/20/22', false),
  ];
  let activeTasks = [
    new Task('Task 1', '4:00 PM', '10/10/22', true),
    new Task('Task 2', '3:00 PM', '10/5/22', true),
  ];
  fakeTasks.map((element, index) => {
    element.id = index + 1;
    element.landlordId = fakeLandlordId;
  });
  activeTasks.map((element, index) => {
    element.id = index + 1;
    element.landlordId = fakeLandlordId;
  });
  let postedTask = new Task('Task 1', '4:00 PM', '10/10/22', true);
  postedTask.id = 1;
  postedTask.landlordId = fakeLandlordId;

  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'delete',
    ]);

    httpClientSpy.post.and.returnValue(of(fakeTasks[0]));
    httpClientSpy.delete.and.returnValue(of(null));

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllTasks should make an http GET request to correct url', () => {
    httpClientSpy.get.and.returnValue(of(fakeTasks));
    service
      .getAllTasks()
      .subscribe((response) => expect(response).toEqual(fakeTasks));
    expect(httpClientSpy.get).toHaveBeenCalledWith(baseURL + 'tasks/all');
  });

  it('getAllActiveTasks should make an http GET request to correct url', () => {
    httpClientSpy.get.and.returnValue(of(activeTasks));
    service
      .getAllActiveTasks(fakeLandlordId)
      .subscribe((response) =>
        expect(response).toEqual(fakeTasks.filter((x) => x.active))
      );
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      baseURL + 'tasks/allActive?id=' + fakeLandlordId
    );
  });

  it('postTask should post Task to tenants landlord using correct http POST url', () => {
    service
      .postTask(fakeTasks[0], fakeLandlordId)
      .subscribe((response) => expect(response).toEqual(postedTask));
    let body = {
      task: fakeTasks[0].task,
      date: fakeTasks[0].date,
      time: fakeTasks[0].time,
    };
    expect(httpClientSpy.post).toHaveBeenCalledWith(
      baseURL + 'tasks/add?id=' + fakeLandlordId,
      body
    );
  });

  it('deleteTask deactivate given Task using correct http DELETE url and body', () => {
    service
      .deleteTask(fakeTasks[0])
      .subscribe((response) => expect(response).toBeNull());
  });

  it('getTaskById should search tasks and get correct task with same id using correct http GET url', () => {
    httpClientSpy.get.and.returnValue(of(fakeTasks[0]));
    service.getAllTasks().subscribe(() => {
      service
        .getTaskById(1)
        .subscribe((response) => expect(response).toEqual(fakeTasks[0]));
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(baseURL + 'tasks/1');
  });

  it('getLandlordIdByTenantId should return landlord id for given tenant id GET url', () => {
    httpClientSpy.get.and.returnValue(of(fakeTasks[0]));
    service
      .getLandlordIdByTenantId(1)
      .subscribe((response) => expect(response).toEqual(fakeTasks[0]));
  });

  it('should handle 0 series error from http requests using the handleErrors function', (done: DoneFn) => {
    const errorResponse0 = new HttpErrorResponse({
      error: 'test 0 status error',
      status: 0,
      statusText: '0 Error',
    });

    httpClientSpy.get.and.returnValue(throwError(() => errorResponse0));

    service.getAllTasks().subscribe({
      next: (task) => done.fail('expected an error'),
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

    service.getAllTasks().subscribe({
      next: (task) => done.fail('expected an error'),
      error: (error) => {
        expect(error.message).toEqual(
          'Something bad happened; please try again later.'
        );
        done();
      },
    });
  });
});
