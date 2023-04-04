import { Component, OnInit } from '@angular/core';
import {
  faPeopleGroup,
  faCheck,
  faBullhorn,
} from '@fortawesome/free-solid-svg-icons';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-landlord-landing-page',
  templateUrl: './landlord-landing-page.component.html',
  styleUrls: ['./landlord-landing-page.component.css'],
})
export class LandlordLandingPageComponent implements OnInit {
  // icons
  faPeopleGroup = faPeopleGroup;
  faCheck = faCheck;
  faBullhorn = faBullhorn;
  myUser: any;

  tempName: string = '';

  constructor(
    private cognitoService: CognitoService,
    private loginService: LoginService
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
