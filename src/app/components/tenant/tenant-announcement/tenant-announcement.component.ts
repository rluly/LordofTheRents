import { Component, OnInit } from '@angular/core';
import { Announcement } from 'src/app/models/announcement';
import { Landlord } from 'src/app/models/landlord';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { MatDialog } from '@angular/material/dialog';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { TenantAnnouncementModalComponent } from '../../tenant/tenant-announcement-modal/tenant-announcement-modal.component';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';
import { Tenant } from 'src/app/models/tenant';
@Component({
  selector: 'app-tenant-announcement',
  templateUrl: './tenant-announcement.component.html',
  styleUrls: ['./tenant-announcement.component.css'],
})
export class TenantAnnouncementComponent implements OnInit {
  announcements: Announcement[] = [];
  isLoading = true;
  landlord: Landlord = {
    id: 0,
    firstName: 'John',
    lastName: 'Doe',
    email: 'someone@someplace.com',
    phoneNumber: '(123)-456-7890',
    accountNumber: 1234,
    routingNumber: 7890,
  };
  name: string = '';
  subject: string = '';
  message: string = '';
  tableVisible: boolean = true;
  id: number = 1;
  landlordId: number = 1;
  tenant: Tenant = new Tenant(0, 0, 'name', '123', 'email');

  //icons
  faCircleInfo = faCircleInfo;

  constructor(
    private announcementService: AnnouncementService,
    public dialog: MatDialog,
    private cognitoService: CognitoService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((user) => {
          this.id = user.id;
          this.getAnnouncements();
        });
    });
  }

  getAnnouncements() {
    this.announcementService
      .getTenantAnnouncements(this.id)
      .subscribe((announcements) => {
        this.announcements = announcements;
        this.announcements.reverse();
        this.isLoading = false;
        this.tableVisible = true;
      });
  }

  viewAnnouncement(id: number | null) {
    this.announcementService.viewAnnouncement(id);
  }

  openSpecificDialog(id: number | null) {
    this.viewAnnouncement(id);
    let dialogRef = this.dialog.open(TenantAnnouncementModalComponent, {
      width: '30em',
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
        console.log('inside tenant');
        this.getAnnouncements();
      }, 500);
      console.log(`Dialog result: ${result}`);
    });
  }
}
