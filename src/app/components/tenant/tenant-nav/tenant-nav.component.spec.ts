import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantNavComponent } from './tenant-nav.component';

describe('TenantNavComponent', () => {
  let component: TenantNavComponent;
  let fixture: ComponentFixture<TenantNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TenantNavComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display navbar links Home, Announcements, Payments, and Schedule, that have correct routerLink properties', () => {
    let links = fixture.nativeElement.querySelectorAll('a');

    expect(links[0].textContent).toEqual('Home');
    expect(links[0].getAttribute('routerLink')).toEqual('home');

    expect(links[1].textContent).toEqual('Announcements');
    expect(links[1].getAttribute('routerLink')).toEqual('announcements');

    expect(links[2].textContent).toEqual('Payments');
    expect(links[2].getAttribute('routerLink')).toEqual('payment');

    expect(links[3].textContent).toEqual('Schedule');
    expect(links[3].getAttribute('routerLink')).toEqual('schedule');
  });

  it('should logout user and send user to Landing Page when Logout link clicked', () => {
    let link = fixture.nativeElement.querySelector('[data-test-id="logout"]');
    const logoutSpy = spyOn(component, 'logout').and.callThrough();

    link.click();
    fixture.detectChanges();

    expect(logoutSpy).toHaveBeenCalled();
  });
});
