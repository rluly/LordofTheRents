import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingpageComponent } from './components/home/landingpage/landingpage.component';
import { LoginComponent } from './components/home/login/login.component';
import { RegistrationComponent } from './components/home/registration/registration.component';
import { LandlordLandingPageComponent } from './components/landlord/landlord-landing-page/landlord-landing-page.component';
import { LandlordNavComponent } from './components/landlord/landlord-nav/landlord-nav.component';
import { LandlordTasksComponent } from './components/landlord/landlord-tasks/landlord-tasks.component';
import { LandlordAnnouncementComponent } from './components/landlord/landlord-announcement/landlord-announcement.component';
import { LandlordViewTenantsComponent } from './components/landlord/landlord-view-tenants/landlord-view-tenants.component';
import { TenantSchedulePageComponent } from './components/tenant/tenant-schedule-page/tenant-schedule-page.component';
import { TenantLandingPageComponent } from './components/tenant/tenant-landing-page/tenant-landing-page.component';
import { TenantNavComponent } from './components/tenant/tenant-nav/tenant-nav.component';
import { TenantPayPageComponent } from './components/tenant/tenant-pay-page/tenant-pay-page.component';
import { TenantAnnouncementComponent } from './components/tenant/tenant-announcement/tenant-announcement.component';
import { LandlordLogin } from './services/landlordLogin.service';
import { TenantLogin } from './services/TenantLogin.service';
import { ErrorComponent } from './components/global/error/error.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  {
    path: 'landlord',
    component: LandlordNavComponent,
    canActivate: [LandlordLogin],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: LandlordLandingPageComponent },
      { path: 'tenants', component: LandlordViewTenantsComponent },
      { path: 'tasks', component: LandlordTasksComponent },
      { path: 'announcements', component: LandlordAnnouncementComponent },
    ],
  },
  {
    path: 'tenant',
    component: TenantNavComponent,
    canActivate: [TenantLogin],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: TenantLandingPageComponent },
      { path: 'announcements', component: TenantAnnouncementComponent },
      { path: 'payment', component: TenantPayPageComponent },
      { path: 'schedule', component: TenantSchedulePageComponent },
    ],
  },
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
