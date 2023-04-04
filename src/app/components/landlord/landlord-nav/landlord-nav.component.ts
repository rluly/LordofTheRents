import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../../services/cognito.service';

@Component({
  selector: 'app-landlord-nav',
  templateUrl: './landlord-nav.component.html',
  styleUrls: ['./landlord-nav.component.css'],
})
export class LandlordNavComponent implements OnInit {
  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {}

  public logout(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
