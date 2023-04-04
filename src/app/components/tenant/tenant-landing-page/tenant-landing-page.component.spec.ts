import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUser } from 'src/app/services/cognito.service';

import { TenantLandingPageComponent } from './tenant-landing-page.component';

describe('TenantLandingPageComponent', () => {
  let component: TenantLandingPageComponent;
  let fixture: ComponentFixture<TenantLandingPageComponent>;

  let testUser: IUser = {
    email: 'test@gmail.com',
    password: 'Test123!',
    showPassword: true,
    code: '',
    name: 'Test',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantLandingPageComponent],
      imports: [HttpClientModule, FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Announcements, Payment, and Schedule cards as clickable links, with correct routerLink paths', () => {
    let cards = fixture.nativeElement.querySelectorAll('li');
    expect(cards[0].getAttribute('routerLink')).toEqual(
      '/tenant/announcements'
    );
    expect(cards[1].getAttribute('routerLink')).toEqual('/tenant/payment');
    expect(cards[2].getAttribute('routerLink')).toEqual('/tenant/schedule');
  });

  it('should display the correct titles and content for each card', () => {
    let headers = fixture.nativeElement.querySelectorAll('h3');
    expect(headers[0].textContent).toEqual('Announcements');
    expect(headers[1].textContent).toEqual('Payment');
    expect(headers[2].textContent).toEqual('Schedule');
    let info = fixture.nativeElement.querySelectorAll('p');
    expect(info[1].textContent).toEqual(
      ' View announcements sent from your landlord about late rent, expected power outages, facility maintenance, etc. '
    );
    expect(info[2].textContent).toEqual(
      ' View outstanding balances for rent and other expenses charged by your landlord. Make payments using a credit card or PayPal account. '
    );
    expect(info[3].textContent).toEqual(
      'Schedule events, such as maintenance requests, repairs, etc.'
    );
  });

  it("greeting name should equal logged in user's first name", () => {
    let greeting = fixture.debugElement.query(By.css('.name'));
    const init = spyOn(component, 'initUser');

    expect(init).not.toHaveBeenCalled();
    expect(greeting.nativeElement.textContent).toEqual('');

    component.ngOnInit();

    component.tempName = testUser.name;

    fixture.detectChanges();

    expect(init).toHaveBeenCalled();
    expect(greeting.nativeElement.textContent).toEqual(testUser.name);
  });
});
