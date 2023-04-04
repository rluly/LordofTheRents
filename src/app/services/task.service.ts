import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public tasks: Task[] = [];
  private baseURL: string = environment.baseURL;

  postHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseURL + 'tasks/all').pipe(
      map((response) => (this.tasks = response)),
      catchError(this.handleError)
    );
  }

  public getAllActiveTasks(id: number): Observable<Task[]> {
    return this.httpClient
      .get<Task[]>(this.baseURL + 'tasks/allActive?id=' + id)
      .pipe(
        map((response) => (this.tasks = response)),
        catchError(this.handleError)
      );
  }

  public getTaskById(id: number): Observable<Task> {
    return this.httpClient.get<Task>(this.baseURL + 'tasks/' + id).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }

  public deleteTask(task: Task): Observable<Task> {
    let body = {
      id: task.id,
      task: task.task,
      date: task.date,
      time: task.time,
    };
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: body,
    };
    return this.httpClient
      .delete<Task>(this.baseURL + 'tasks/deactivate', options)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  public getLandlordIdByTenantId(id: number): Observable<Task> {
    return this.httpClient
      .get<Task>(this.baseURL + 'tenants/landlordId?id=' + id)
      .pipe(
        map((response) => response),
        catchError(this.handleError)
      );
  }

  public postTask(task: Task, id: number): Observable<Task> {
    let body = { task: task.task, date: task.date, time: task.time };
    return this.httpClient
      .post<Task>(this.baseURL + 'tasks/add?id=' + id, body)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
