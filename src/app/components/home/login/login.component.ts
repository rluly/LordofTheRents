import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService, IUser } from 'src/app/services/cognito.service';
import { LoggedInUserService } from 'src/app/services/logged-in-user.service';
import { LoginService } from 'src/app/services/login.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  isLoading = false;

  user: IUser;
  constructor(
    private loginService: LoginService,
    private router: Router,
    private loggedInUser: LoggedInUserService,
    private cognitoService: CognitoService,
    private toast: NgToastService
  ) {
    this.user = {} as IUser;
  }

  findUser(): void {
    this.loginService.getLogginUserInput(this.email).subscribe((val) => {
      console.log(val);
      this.user = val;
      if (this.user.hasOwnProperty('tenants')) {
        this.loggedInUser.setUser(this.user);
        this.isLoading = false;
        this.router.navigate(['/landlord']);
        setTimeout(() => {
          this.toast.info({
            detail: 'Get a Quote with GEICO Today!',
            summary:
              'GEICO could save you money, time, and worry. GEICO offers multiple insurance discounts, easy ways to manage your policy, and fast claims service.',
            position: 'bl',
            duration: 6000,
          });
        }, 2000);
      } else {
        this.loggedInUser.setUser(this.user);
        this.isLoading = false;
        this.router.navigate(['/tenant']);
        setTimeout(() => {
          this.toast.info({
            detail: 'Get a Quote with GEICO Today!',
            summary:
              'GEICO could save you money, time, and worry. GEICO offers multiple insurance discounts, easy ways to manage your policy, and fast claims service.',
            position: 'bl',
            duration: 6000,
          });
        }, 2000);
      }
    });
  }

  loginEvent() {
    this.isLoading = true;
    this.user.email = this.email;
    this.user.password = this.password;
    this.cognitoService
      .signIn(this.user)
      .then(() => {
        this.findUser();
      })
      .catch(() => {
        console.log('error');
        this.isLoading = false;
        this.toast.error({
          detail: 'Error',
          summary: 'Submit valid login information',
          position: 'tr',
          duration: 5000,
        });
      });
  }

  signupEvent() {
    this.loginService.navigateRegister();
  }

  ngOnInit(): void {}
}
