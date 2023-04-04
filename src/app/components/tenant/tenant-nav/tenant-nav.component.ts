import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '../../../services/cognito.service';
@Component({
  selector: 'app-tenant-nav',
  templateUrl: './tenant-nav.component.html',
  styleUrls: ['./tenant-nav.component.css'],
})
export class TenantNavComponent implements OnInit {
  constructor(private router: Router, private cognitoService: CognitoService) {}

  ngOnInit(): void {}

  public logout(): void {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }
}
