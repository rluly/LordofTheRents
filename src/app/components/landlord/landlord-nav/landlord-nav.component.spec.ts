import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CognitoService } from 'src/app/services/cognito.service';
import { LandlordNavComponent } from './landlord-nav.component';

describe('LandlordNavComponent', () => {
  let component: LandlordNavComponent;
  let fixture: ComponentFixture<LandlordNavComponent>;

  const cognitoServiceSpy = jasmine.createSpyObj('CognitoService', ['signOut']);

  beforeEach(async () => {
    cognitoServiceSpy.signOut.and.returnValue(Promise.resolve(true));
    await TestBed.configureTestingModule({
      declarations: [LandlordNavComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: CognitoService, useValue: cognitoServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LandlordNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display navbar links Home, Tenants, Tasks, and Announcements, that have correct routerLink properties', () => {
    let links = fixture.nativeElement.querySelectorAll('a');

    expect(links[0].textContent).toEqual('Home');
    expect(links[0].getAttribute('routerLink')).toEqual('home');

    expect(links[1].textContent).toEqual('Tenants');
    expect(links[1].getAttribute('routerLink')).toEqual('tenants');

    expect(links[2].textContent).toEqual('Tasks');
    expect(links[2].getAttribute('routerLink')).toEqual('tasks');

    expect(links[3].textContent).toEqual('Announcements');
    expect(links[3].getAttribute('routerLink')).toEqual('announcements');
  });

  it('should logout user and send user to Landing Page when Logout link clicked', () => {
    let link = fixture.nativeElement.querySelector('[data-test-id="logout"]');
    const logoutSpy = spyOn(component, 'logout').and.callThrough();

    link.click();
    fixture.detectChanges();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
