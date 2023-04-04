import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CognitoService {
  private authenticationSubject: BehaviorSubject<any>;

  constructor(private router: Router) {
    Amplify.configure({
      Auth: environment.cognito,
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  canActivate(): Observable<boolean> {
    return this.isAuthenticated().pipe(
      map((res) => {
        if (res) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      })
    );
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(user: IUser): Promise<any> {
    return Auth.signIn({
      username: user.email,
      password: user.password,
    }).then(() => {
      this.authenticationSubject.next(true);
    });
  }

  public signOut(): Promise<any> {
    return Auth.signOut().then(() => {
      this.authenticationSubject.next(false);
    });
  }

  isAuthenticated(): Observable<boolean> {
    Auth.currentUserInfo().then((user) => {
      if (user) {
        this.authenticationSubject.next(true);
      } else {
        this.authenticationSubject.next(false);
      }
    });
    return this.authenticationSubject.asObservable();
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public async getUserAttributes() {
    return await Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser().then((cognitoUser: any) => {
      return Auth.updateUserAttributes(cognitoUser, user);
    });
  }
}
