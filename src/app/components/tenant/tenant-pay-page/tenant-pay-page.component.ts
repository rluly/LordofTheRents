import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';

declare var paypal: any;

@Component({
  selector: 'app-tenant-pay-page',
  templateUrl: './tenant-pay-page.component.html',
  styleUrls: ['./tenant-pay-page.component.css'],
})
export class TenantPayPageComponent implements OnInit {
  email: string = 'gavin123@gmail.com';
  paidFor: boolean = false;
  amount: string = '1000';
  money: string = '1';

  @ViewChild('paypal', { static: true })
  paypalElement!: ElementRef;
  currentTenant: any;

  constructor(
    private route: Router,
    private http: HttpClient,
    private cognitoService: CognitoService,
    private loginService: LoginService
  ) {}

  product = {
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [
          {
            description: 'Manager To Owner Payment',
            amount: {
              currency_code: 'USD',
              value: this.amount,
            },
            payee: {
              email_address: this.email,
            },
          },
        ],
      });
    },

    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal',
    },

    onApprove: async (data: any, actions: any) => {
      const order = await actions.order.capture();
      this.paidFor = true;
      console.log(order);
    },
    onError: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit() {
    paypal.Buttons(this.product).render(this.paypalElement.nativeElement);
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((user: any) => {
          this.loginService
            .getLandlordIdByTenantId(user.id)
            .subscribe((landId: any) => {
              this.loginService
                .getLandlordById(landId)
                .subscribe((landlord: any) => {
                  this.email = landlord.email;
                  console.log(this.email);
                });
            });
        });
    });
  }
}
