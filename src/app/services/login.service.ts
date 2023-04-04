import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseURL: string = environment.baseURL;

  constructor(private router: Router, private http: HttpClient) {}

  public getLandlordIdByTenantId(id: number): Observable<any> {
    return this.http
      .get<any>(this.baseURL + `tenants/landlordId?id=${id}`)
      .pipe(catchError(this.handleError));
  }
  public getLandlordById(id: number): Observable<any> {
    return this.http
      .get<any>(this.baseURL + `landlords/${id}`)
      .pipe(catchError(this.handleError));
  }

  navigateRegister() {
    this.router.navigate(['/register']);
  }

  public getLogginUserInput(email: string): Observable<any> {
    return this.http
      .get<any>(this.baseURL + `landlords/loginByEmail?email=${email}`)
      .pipe(catchError(this.handleError));
  }

  public handleError(error: HttpErrorResponse) {
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

      alert('not a user');
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
