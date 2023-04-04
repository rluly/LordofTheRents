import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Announcement } from 'src/app/models/announcement';
import { Router } from '@angular/router';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-tenant-announcement-modal',
  templateUrl: './tenant-announcement-modal.component.html',
  styleUrls: ['./tenant-announcement-modal.component.css'],
})
export class TenantAnnouncementModalComponent implements OnInit {
  announcement?: Announcement;
  id: number = 0;

  //icons
  faCircleXmark = faCircleXmark;
  constructor(
    public dialogRef: MatDialogRef<TenantAnnouncementModalComponent>,
    private announcementService: AnnouncementService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close('Success');
  }

  deleteAnnouncement() {
    if (this.router.url === '/landlord/announcements') {
      this.announcementService
        .deleteLandlordAnnouncement(this.announcement)
        .subscribe((res) => console.log(res));
    } else {
      this.announcementService
        .deleteTenantAnnouncement(this.announcement)
        .subscribe((res) => console.log(res));
    }
    this.closeDialog();
  }

  getAnnouncement() {
    this.announcementService
      .getAnnouncementById()
      .subscribe((announcement) => (this.announcement = announcement));
  }

  ngOnInit(): void {
    this.getAnnouncement();
  }
}
