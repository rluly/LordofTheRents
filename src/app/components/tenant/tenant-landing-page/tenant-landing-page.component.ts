import { Component, OnInit } from '@angular/core';
import {
  faCheck,
  faBullhorn,
  faDollarSign,
  faCalendar,
} from '@fortawesome/free-solid-svg-icons';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoggedInUserService } from 'src/app/services/logged-in-user.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-tenant-landing-page',
  templateUrl: './tenant-landing-page.component.html',
  styleUrls: ['./tenant-landing-page.component.css'],
})
export class TenantLandingPageComponent implements OnInit {
  // icons
  faDollarSign = faDollarSign;
  faCheck = faCheck;
  faBullhorn = faBullhorn;
  faCalendar = faCalendar;
  myUser: any;

  tempName: string = '';

  constructor(
    private cognitoService: CognitoService,
    private loginService: LoginService,
    private loggedInUSer: LoggedInUserService
  ) {}

  initUser() {
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((user) => {
          this.myUser = user;
          this.tempName = this.myUser.firstName;
        });
    });
  }

  ngOnInit(): void {
    this.initUser();
  }
}
