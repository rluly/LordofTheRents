import { Injectable } from '@angular/core';
import { Announcement } from '../models/announcement';
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
export class AnnouncementService {
  public announcements: Announcement[] = [];
  private baseURL: string = environment.baseURL;
  private id: number = 1;
  public viewId: number | null;

  postHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {
    this.viewId = 0;
  }

  public getLandlordAnnouncements(
    id: number | null
  ): Observable<Announcement[]> {
    let param = '?id=' + id;
    return this.httpClient
      .get<Announcement[]>(
        this.baseURL + 'sentAnnouncements/allActiveLandlords' + param
      )
      .pipe(
        map((announcements) => (this.announcements = announcements)),
        catchError(this.handleError)
      );
  }

  public getTenantAnnouncements(id: number): Observable<Announcement[]> {
    let param = '?id=' + id;
    return this.httpClient
      .get<Announcement[]>(
        this.baseURL + 'sentAnnouncements/allActiveTenants' + param
      )
      .pipe(
        map((announcements) => (this.announcements = announcements)),
        catchError(this.handleError)
      );
  }

  public getTenantById(id: number): Observable<any> {
    return this.httpClient
      .get<any>(this.baseURL + 'tenants/' + id)
      .pipe(catchError(this.handleError));
  }

  public getLandlordId(id: number): Observable<number> {
    let param = '?id=1';
    return this.httpClient
      .get<any>(this.baseURL + 'tenants/landlordId' + param)
      .pipe(catchError(this.handleError));
  }

  public getLandlordByTenantId(id: number): Observable<any> {
    return this.httpClient
      .get<any>(this.baseURL + 'landlords/' + id)
      .pipe(catchError(this.handleError));
  }

  public addAnnouncement(
    subject: string | null | undefined,
    message: string | null | undefined,
    date: string,
    time: string,
    landlordId: number,
    tenantId: number
  ): Observable<Announcement> {
    let param = '?landlordId=' + landlordId + '&tenantId=' + tenantId;
    let announcement = {
      subject: subject,
      message: message,
      date: date,
      time: time,
    };
    return this.httpClient
      .post<Announcement>(
        this.baseURL + 'sentAnnouncements/add' + param,
        announcement,
        this.postHeader
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  public deleteLandlordAnnouncement(
    announcement: Announcement | undefined
  ): Observable<ArrayBuffer> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: announcement,
    };
    return this.httpClient
      .request<ArrayBuffer>(
        'delete',
        this.baseURL + 'sentAnnouncements/deactivateLandlord',
        httpOptions
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  public deleteTenantAnnouncement(
    announcement: Announcement | undefined
  ): Observable<ArrayBuffer> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: announcement,
    };
    return this.httpClient
      .request<ArrayBuffer>(
        'delete',
        this.baseURL + 'sentAnnouncements/deactivateTenant',
        httpOptions
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  public viewAnnouncement(id: number | null) {
    this.viewId = id;
  }

  public getAnnouncementById(): Observable<Announcement | undefined> {
    return of(
      this.announcements.find((announcement) => announcement.id === this.viewId)
    );
  }

  private handleError(error: HttpErrorResponse) {
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
