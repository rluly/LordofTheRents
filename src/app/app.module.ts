import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TenantLandingPageComponent } from './components/tenant/tenant-landing-page/tenant-landing-page.component';
import { RegistrationComponent } from './components/home/registration/registration.component';
import { LandingpageComponent } from './components/home/landingpage/landingpage.component';
import { LoginComponent } from './components/home/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LandlordLandingPageComponent } from './components/landlord/landlord-landing-page/landlord-landing-page.component';
import { LandlordNavComponent } from './components/landlord/landlord-nav/landlord-nav.component';
import { TenantNavComponent } from './components/tenant/tenant-nav/tenant-nav.component';
import { TenantPayPageComponent } from './components/tenant/tenant-pay-page/tenant-pay-page.component';
import { LandlordTasksComponent } from './components/landlord/landlord-tasks/landlord-tasks.component';
import { FooterComponent } from './components/global/footer/footer.component';
import { LandlordAnnouncementComponent } from './components/landlord/landlord-announcement/landlord-announcement.component';
import { TenantAnnouncementComponent } from './components/tenant/tenant-announcement/tenant-announcement.component';
import { LandlordViewTenantsComponent } from './components/landlord/landlord-view-tenants/landlord-view-tenants.component';
import { LandlordViewMessagesModalComponent } from './components/landlord/landlord-view-tenants/landlord-view-messages-modal/landlord-view-messages-modal.component';
import { LandlordComposeMessageModalComponent } from './components/landlord/landlord-view-tenants/landlord-compose-message-modal/landlord-compose-message-modal.component';
import { TenantSchedulePageComponent } from './components/tenant/tenant-schedule-page/tenant-schedule-page.component';
import { LandlordLogin } from './services/landlordLogin.service';
import { TenantLogin } from './services/TenantLogin.service';
import { NgToastModule } from 'ng-angular-popup';
import { ErrorComponent } from './components/global/error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    LandingpageComponent,
    // landlord
    LandlordLandingPageComponent,
    LandlordNavComponent,
    LandlordAnnouncementComponent,
    // LandlordAnnouncementModalComponent,
    // tenant
    TenantLandingPageComponent,
    TenantNavComponent,
    TenantPayPageComponent,
    LandlordTasksComponent,
    TenantSchedulePageComponent,
    //footer
    FooterComponent,
    TenantAnnouncementComponent,
    // TenantAnnouncementModalComponent,
    LandlordViewTenantsComponent,
    LandlordViewMessagesModalComponent,
    LandlordComposeMessageModalComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatDialogModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    NgToastModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    LandlordLogin,
    TenantLogin,
    ErrorComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
