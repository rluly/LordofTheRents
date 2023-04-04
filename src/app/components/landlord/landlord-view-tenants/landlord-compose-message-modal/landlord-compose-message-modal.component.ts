import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { AnnouncementService } from 'src/app/services/announcement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landlord-compose-message-modal',
  templateUrl: './landlord-compose-message-modal.component.html',
  styleUrls: ['./landlord-compose-message-modal.component.css'],
})
export class LandlordComposeMessageModalComponent implements OnInit {
  faCircleXmark = faCircleXmark;

  @Input() selectedTenants: any[] = [];
  @Input() landlordId: number = -1;

  isSelectedTenantsValid: boolean = false;

  recipients: string = '';

  submitted: boolean = false;
  showMessageSent: boolean = false;

  messageForm = new FormGroup({
    subject: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<LandlordComposeMessageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public announcementService: AnnouncementService,
    private router: Router
  ) {}

  submit() {
    this.submitted = true;
    if (this.messageForm.valid && this.submitted) {
      this.showMessageSent = true;
      let today = new Date();
      let time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      let date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
      this.selectedTenants.map((tenant) => {
        this.announcementService
          .addAnnouncement(
            this.messageForm.value.subject,
            this.messageForm.value.message,
            date,
            time,
            this.landlordId,
            tenant.id
          )
          .subscribe((res) => console.log(res));
      });
    }
  }

  closeDialog() {
    this.dialogRef.close('Success');
  }

  ngOnInit(): void {
    this.recipients = this.selectedTenants
      .map((x) => x.firstName + ' ' + x.lastName)
      .join('; ');
    //truncate recipients to fit textbox if too long
    this.recipients =
      this.recipients.length > 30
        ? this.recipients?.substring(0, 20) + '...'
        : this.recipients;
  }
}
