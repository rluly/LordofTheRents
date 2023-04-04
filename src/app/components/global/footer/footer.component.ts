import { Component, OnInit } from '@angular/core';
import {
  faFacebook,
  faTwitter,
  faLinkedinIn,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedinIn = faLinkedinIn;
  faGithub = faGithub;

  constructor() {}

  ngOnInit(): void {}
}
