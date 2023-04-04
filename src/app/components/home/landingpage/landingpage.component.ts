import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css'],
})
export class LandingpageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSignUp() {
    this.router.navigate(['/register']);
    console.log('go to signup page');
  }

  onlogin() {
    this.router.navigate(['/login']);
    console.log('go to login page');
  }
}
