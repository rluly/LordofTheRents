import { CanActivate, Router } from '@angular/router';
import { CognitoService } from './cognito.service';
import { LoginService } from './login.service';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LandlordLogin implements CanActivate {
  constructor(
    private cognito: CognitoService,
    private router: Router,
    private loginService: LoginService
  ) {}

  canActivate(): Observable<boolean> {
    var subject = new Subject<boolean>();
    this.cognito
      .getUserAttributes()
      .then((val) => {
        this.loginService
          .getLogginUserInput(val.attributes.email)
          .subscribe((user: any) => {
            if (user.hasOwnProperty('tenants')) {
              subject.next(true);
            } else {
              this.router.navigate(['']);
              subject.next(false);
            }
          });
      })
      .catch((error) => {
        this.router.navigate(['']);
        subject.next(false);
      });

    return subject.asObservable();
  }
}
