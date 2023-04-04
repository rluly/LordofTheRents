import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggedInUserService {
  user: any;

  public setUser(loggedInUSer: any) {
    this.user = loggedInUSer;
  }

  public getUser(): any {
    return this.user;
  }

  public clearUser() {
    this.user = null;
  }

  constructor() {}
}
