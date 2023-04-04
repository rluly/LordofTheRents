import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faCaretRight,
  faCaretLeft,
  faEye,
  faEyeSlash,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Landlord } from 'src/app/models/landlord';
import { Register } from 'src/app/models/register';
import { RegisterService } from 'src/app/services/register.service';
import { IUser, CognitoService } from '../../../services/cognito.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit, AfterViewChecked {
  step: any = 1;
  submitted: any = false;
  landlords: Landlord[] = [];

  //to show hide passwords
  formPassword: any;
  formcPassword: any;
  passShow: any = false;
  cpassShow: any = false;

  //icons
  faCaretRight = faCaretRight;
  faCaretLeft = faCaretLeft;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faCircleXmark = faCircleXmark;

  isConfirm?: boolean;
  user: IUser;
  code?: String;

  passMatch: boolean = true;

  constructor(
    private route: Router,
    private cognitoService: CognitoService,
    private registerService: RegisterService,
    private toast: NgToastService
  ) {
    this.user = {} as IUser;
  }
  ngAfterViewChecked(): void {
    this.landlords;
  }

  regForm = new FormGroup({
    userDetails: new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=\D*\d)(?=.*[$@$!%*?&])(?=[A-Za-z]).{6,30}$/),
      ]),
      cPassword: new FormControl('', [Validators.required]),
    }),
    contactDetails: new FormGroup({
      phone: new FormControl('', [Validators.required]),
      user: new FormControl('', [Validators.required]),
      landlord: new FormControl(''),
      policy: new FormControl('', [Validators.required]),
    }),
  });

  ngOnInit(): void {
    this.formPassword = 'password';
    this.formcPassword = 'password';
    this.isConfirm = false;
    this.loadLandlords();
  }

  //show password on eye icon click
  showPass() {
    if (this.formPassword === 'password') {
      this.formPassword = 'text';
      this.passShow = true;
    } else {
      this.formPassword = 'password';
      this.passShow = false;
    }
  }

  //show confirm password on eye icon click
  showcPass() {
    if (this.formcPassword === 'password') {
      this.formcPassword = 'text';
      this.cpassShow = true;
    } else {
      this.formcPassword = 'password';
      this.cpassShow = false;
    }
  }

  //shows landlord dropdown when selected tenant in rreg form
  formTenant = false;
  formLandlord = true;

  showDropDown(divid: string) {
    if (divid === 'tenantDrop') {
      this.formTenant = true;
      this.formLandlord = false;
    } else if (divid === 'hide') {
      this.formTenant = false;
      this.formLandlord = true;
    }
  }

  get userDetails() {
    return this.regForm.controls['userDetails']['controls'];
  }

  get contactDetails() {
    return this.regForm.controls['contactDetails']['controls'];
  }

  get firstName() {
    return this.userDetails.firstName.value;
  }

  get lastName() {
    return this.userDetails.lastName.value;
  }

  get email() {
    return this.userDetails.email.value;
  }

  get password() {
    return this.userDetails.password.value;
  }

  get phone(): number {
    return parseInt(this.contactDetails.phone.value!);
  }

  get landlord() {
    return parseInt(this.contactDetails.landlord.value!);
  }

  loadLandlords() {
    this.registerService
      .getAllLandlords()
      .subscribe((land) => (this.landlords = land));
  }

  prepareSave(): Register {
    return new Register(
      null,
      this.firstName!,
      this.lastName!,
      this.email!,
      this.password!,
      this.phone!,
      this.landlord!
    );
  }

  passMatchFunction() {
    if (
      this.regForm.controls.userDetails.controls.password.value !=
      this.regForm.controls.userDetails.controls.cPassword.value
    ) {
      this.passMatch = false;
    }
  }

  submit() {
    this.submitted = true;
    this.passMatchFunction();
    if (
      (this.regForm.controls.userDetails.invalid && this.step == 1) ||
      this.regForm.controls.userDetails.controls.password.value !=
        this.regForm.controls.userDetails.controls.cPassword.value
    ) {
      console.log('userDetails invalid and step is 1');
      return;
    }
    if (this.regForm.controls.contactDetails.invalid && this.step == 2) {
      console.log('contactDetails invalid and step is 2');
      return;
    }
    this.step = this.step + 1;

    if (this.step == 3) {
      this.isConfirm = true;
      this.cognitoService.signUp(this.user);
    }

    if (this.regForm.controls.userDetails.controls.email.value != null) {
      this.user.email = this.regForm.controls.userDetails.controls.email.value;
    }

    if (this.regForm.controls.userDetails.controls.password.value != null) {
      this.user.password =
        this.regForm.controls.userDetails.controls.password.value;
    }
  }

  public confirmSignUp(): void {
    if (this.regForm.valid && this.contactDetails.user.value == 'landlord') {
      let landlord = this.prepareSave();
      this.registerService.postRegisterLandlord(landlord).subscribe((_res) => {
        this.route.navigate(['/login']);
        this.toast.success({
          detail: 'Success',
          summary: 'Registered Successfully!',
          position: 'tr',
          duration: 5000,
        });
      });
    }

    if (this.regForm.valid && this.contactDetails.user.value == 'tenant') {
      let tenant = this.prepareSave();
      this.registerService.postRegisterTenant(tenant).subscribe((_res) => {
        this.route.navigate(['/login']);
        this.toast.success({
          detail: 'Success',
          summary: 'Registered Successfully!',
          position: 'tr',
          duration: 5000,
        });
      });
    }

    this.cognitoService.confirmSignUp(this.user).then(() => {
      this.route.navigate(['/login']);
    });
  }

  previous() {
    this.step = this.step - 1;
  }
}
