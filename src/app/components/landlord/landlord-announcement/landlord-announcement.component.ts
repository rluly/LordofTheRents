import { Component, OnInit } from '@angular/core';
import { Announcement } from '../../../models/announcement';

import { AnnouncementService } from 'src/app/services/announcement.service';
import { MatDialog } from '@angular/material/dialog';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { TenantAnnouncementModalComponent } from '../../tenant/tenant-announcement-modal/tenant-announcement-modal.component';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-landlord-announcement',
  templateUrl: './landlord-announcement.component.html',
  styleUrls: ['./landlord-announcement.component.css'],
})
export class LandlordAnnouncementComponent implements OnInit {
  announcements: Announcement[] = [];
  tenantNames: string[] = [];
  tenantAnnouncements = new Array();
  namesByAnnouncements = new Array();
  name: string = '';
  subject: string = '';
  message: string = '';
  tableVisible: boolean = true;
  id: number = 1;
  isLoading = true;

  //icons
  faCircleInfo = faCircleInfo;

  constructor(
    private announcementService: AnnouncementService,
    public dialog: MatDialog,
    private cognitoService: CognitoService,
    private loginService: LoginService
  ) {}

  getAnnouncements() {
    this.announcementService
      .getLandlordAnnouncements(this.id)
      .subscribe((ann) => {
        this.announcements = ann;
        this.announcements.reverse();
        this.getNames();
        this.isLoading = false;
        this.tableVisible = true;
      });
  }

  getNames() {
    let ii = 0;
    this.announcements.forEach((announcement) => {
      let jj = 0;
      this.tenantAnnouncements.forEach((tenantAnnouncemnt0 = new Array()) => {
        tenantAnnouncemnt0.forEach((tenantAnnouncement: any) => {
          if (announcement.id === tenantAnnouncement.id) {
            this.namesByAnnouncements[ii] = this.tenantNames[jj];
          }
        });
        jj++;
      });
      ii++;
    });
  }

  viewAnnouncement(id: number | null) {
    this.announcementService.viewAnnouncement(id);
  }

  openSpecificDialog(id: number | null) {
    this.viewAnnouncement(id);
    let dialogRef = this.dialog.open(TenantAnnouncementModalComponent, {
      width: '40em',
      height: 'min(fit-content, 50em)',
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tableVisible = false;
      this.isLoading = true;
      while (this.announcements.length > 0) {
        this.announcements.pop();
      }
      setTimeout(() => {
        this.getAnnouncements();
      }, 500);

      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((user) => {
          console.log(user);
          this.id = user.id;
          user.tenants.forEach((tenant: any) => {
            this.tenantNames.push(tenant.firstName + ' ' + tenant.lastName);
            this.tenantAnnouncements.push(tenant.sentAnnouncements);
          });
          console.log(this.tenantAnnouncements);
          this.getAnnouncements();
        });
    });
  }
}
