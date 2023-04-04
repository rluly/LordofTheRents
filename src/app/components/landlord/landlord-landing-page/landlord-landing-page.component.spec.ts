import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IUser } from 'src/app/services/cognito.service';
import { LandlordLandingPageComponent } from './landlord-landing-page.component';

describe('LandlordLandingPageComponent', () => {
  let component: LandlordLandingPageComponent;
  let fixture: ComponentFixture<LandlordLandingPageComponent>;

  let testUser: IUser = {
    email: 'test@gmail.com',
    password: 'Test123!',
    showPassword: true,
    code: '',
    name: 'Test',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandlordLandingPageComponent],
      imports: [HttpClientModule, FontAwesomeModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should display Tenants, Tasks, and Announcements cards as clickable links, with correct routerLink paths', () => {
    let cards = fixture.nativeElement.querySelectorAll('li');
    expect(cards[0].getAttribute('routerLink')).toEqual('/landlord/tenants');
    expect(cards[1].getAttribute('routerLink')).toEqual('/landlord/tasks');
    expect(cards[2].getAttribute('routerLink')).toEqual(
      '/landlord/announcements'
    );
  });

  it('should display the correct titles and content for each card', () => {
    let headers = fixture.nativeElement.querySelectorAll('h3');
    expect(headers[0].textContent).toEqual('Tenants');
    expect(headers[1].textContent).toEqual('Tasks');
    expect(headers[2].textContent).toEqual('Announcements');
    let info = fixture.nativeElement.querySelectorAll('p');
    expect(info[1].textContent).toEqual(
      ' View all of your tenants and their corresponding information, such as name, phone number, and email. View past messages sent with your tenants and compose new messages. '
    );
    expect(info[2].textContent).toEqual(
      ' View all upcoming tasks, such as maintenance requests, repairs, etc. '
    );
    expect(info[3].textContent).toEqual(
      ' Send announcements to tenants to alert them about late rent, expected power outages, facility maintenance, etc. '
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
