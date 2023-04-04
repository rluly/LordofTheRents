import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Register } from '../models/register';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Landlord } from '../models/landlord';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  public landlords: Landlord[] = [];
  private baseURL: string = environment.baseURL;

  postHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {}

  public getAllLandlords(): Observable<Landlord[]> {
    return this.httpClient
      .get<Landlord[]>(this.baseURL + 'landlords/allActive')
      .pipe(
        map((res) => (this.landlords = res)),
        catchError(this.handleError)
      );
  }

  public postRegisterLandlord(reg: Register): Observable<Register> {
    return this.httpClient
      .post<Register>(this.baseURL + 'landlords/add', reg, this.postHeader)
      .pipe(
        map((res) => res),
        catchError(this.handleError)
      );
  }

  public postRegisterTenant(reg: Register): Observable<Register> {
    let param = reg.landlordId;
    return this.httpClient
      .post<Register>(
        this.baseURL + 'tenants/add?id=' + param,
        reg,
        this.postHeader
      )
      .pipe(
        map((res) => res),
        catchError(this.handleError)
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
