import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';
import { LandlordComposeMessageModalComponent } from './landlord-compose-message-modal/landlord-compose-message-modal.component';
import { LandlordViewMessagesModalComponent } from './landlord-view-messages-modal/landlord-view-messages-modal.component';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-landlord-view-tenants',
  templateUrl: './landlord-view-tenants.component.html',
  styleUrls: ['./landlord-view-tenants.component.css'],
})
export class LandlordViewTenantsComponent implements OnInit {
  tenants: any[] = [];

  selectedTenants: any[] = [];
  isLoading = true;

  landlordId: number = -1;
  users: any;

  myUser: any;
  //icons
  faCircleInfo = faCircleInfo;
  constructor(
    public dialog: MatDialog,
    private cognitoService: CognitoService,
    private loginService: LoginService,
    private toast: NgToastService
  ) {}

  setRecipients(id: number) {
    let tenantIndex = this.selectedTenants.findIndex((x) => x.id === id);
    if (tenantIndex === -1) {
      this.selectedTenants.push(this.tenants.filter((x) => x.id === id)[0]);
    } else {
      this.selectedTenants = this.selectedTenants.filter((x) => x.id !== id);
    }
  }

  openDialogViewMessages(tenant: any) {
    let dialogRef = this.dialog.open(LandlordViewMessagesModalComponent, {
      width: '40em',
      height: 'min(fit-content, 50em)',
      hasBackdrop: true,
    });

    (<LandlordViewMessagesModalComponent>dialogRef.componentInstance).tenant =
      tenant;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogComposeSelected() {
    if (
      this.selectedTenants === undefined ||
      this.selectedTenants.length === 0
    ) {
      this.toast.error({
        detail: 'Error',
        summary: 'Please Add Recipients',
        position: 'tr',
        duration: 5000,
      });
      return;
    }

    let dialogRef = this.dialog.open(LandlordComposeMessageModalComponent, {
      width: '40em',
      height: 'min(fit-content, 50em)',
      hasBackdrop: true,
    });

    (<LandlordComposeMessageModalComponent>(
      dialogRef.componentInstance
    )).selectedTenants = this.selectedTenants;
    (<LandlordComposeMessageModalComponent>(
      dialogRef.componentInstance
    )).landlordId = this.landlordId;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialogComposeAll() {
    let dialogRef = this.dialog.open(LandlordComposeMessageModalComponent, {
      width: '40em',
      height: 'min(fit-content, 50em)',
      hasBackdrop: true,
    });

    (<LandlordComposeMessageModalComponent>(
      dialogRef.componentInstance
    )).selectedTenants = this.tenants;
    (<LandlordComposeMessageModalComponent>(
      dialogRef.componentInstance
    )).landlordId = this.landlordId;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit(): void {
    // need to change this implementation at some point to get
    // user.id and getAllactive tenants from backend rather than loop
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((user) => {
          this.landlordId = user.id;
          this.myUser = val;
          for (let i = 0; i < user.tenants.length; i++) {
            if (user.tenants[i].active) this.tenants.push(user.tenants[i]);
          }
          this.isLoading = false;
        });
    });
  }
}
