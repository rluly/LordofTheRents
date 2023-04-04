import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-landlord-view-messages-modal',
  templateUrl: './landlord-view-messages-modal.component.html',
  styleUrls: ['./landlord-view-messages-modal.component.css'],
})
export class LandlordViewMessagesModalComponent implements OnInit {
  allAnnouncements: any[] = [];

  fullMessages: any[] = [];
  isFullMessageShown: boolean = false;
  //icons
  faCircleXmark = faCircleXmark;
  @Input() tenant: any;
  @Input() landlordId: number = -1;

  constructor(
    public dialogRef: MatDialogRef<LandlordViewMessagesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public annoucementService: AnnouncementService,
    private router: Router
  ) {}

  toggleFullMessage(index: number) {
    this.allAnnouncements[index].isShort =
      !this.allAnnouncements[index].isShort;
  }

  closeDialog() {
    this.dialogRef.close('Success');
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.allAnnouncements.map((x) => {
        x.shortMessage = x.message.substring(0, 20);
        x.isShort = true;
      });
    }, 50);
  }

  ngOnInit(): void {
    if (this.tenant) {
      this.annoucementService.getTenantById(this.tenant.id).subscribe((val) => {
        this.allAnnouncements = val.sentAnnouncements.filter(
          (ann: { landlordIsActive: any }) => ann.landlordIsActive
        );
        this.allAnnouncements.reverse();
      });
    }
  }
}
