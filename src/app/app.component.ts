import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CognitoService } from './services/cognito.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.isAuthenticated = false;
  }

  public ngOnInit(): void {
    this.cognitoService
      .isAuthenticated()
      .subscribe((res) => (this.isAuthenticated = res));
  }

  public signOut(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
