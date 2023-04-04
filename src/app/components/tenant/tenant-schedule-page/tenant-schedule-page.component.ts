import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Task } from 'src/app/models/task';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';
import { TaskService } from 'src/app/services/task.service';
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-tenant-schedule-page',
  templateUrl: './tenant-schedule-page.component.html',
  styleUrls: ['./tenant-schedule-page.component.css'],
})
export class TenantSchedulePageComponent implements OnInit {
  scheduleForm: FormGroup;
  listData: any;
  invalidSubmitted: any = false;
  faCircleXmark = faCircleXmark;
  landlordId: any;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private cognitoService: CognitoService,
    private loginService: LoginService,
    private toast: NgToastService
  ) {
    this.listData = [];
    this.scheduleForm = this.fb.group({
      reason: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  reset() {
    this.scheduleForm.reset();
  }

  removeItem(element: any) {
    this.listData.forEach((value: any, index: any) => {
      if (value == element) {
        this.listData.splice(index, 1);
      }
    });
  }

  convertDateTime(datetime: string): [string, string] {
    let date = datetime.split('T')[0];
    let time = datetime.split('T')[1];
    // convert date
    let year = date.split('-')[0];
    let month = date.split('-')[1];
    let day = date.split('-')[2];
    date = month + '/' + day + '/' + year.substring(2, year.length);
    // convert time
    let hours = +time.split(':')[0];
    let timeOfDay = hours > 12 ? 'PM' : 'AM';
    hours -= hours > 12 ? 12 : 0;
    time = hours + ':' + time.split(':')[1] + ' ' + timeOfDay;
    return [date, time];
  }

  submit() {
    if (this.scheduleForm.valid) {
      this.listData.push(this.scheduleForm.value);
      let formValue = this.scheduleForm.value;
      let datetime = this.convertDateTime(formValue.date);
      this.taskService
        .postTask(
          new Task(
            formValue.reason + ':' + formValue.details,
            datetime[1],
            datetime[0],
            true
          ),
          this.landlordId
        )
        .subscribe((response) => console.log(response));
      this.scheduleForm.reset();
      this.toast.success({
        detail: 'Success',
        summary: 'Meeting Scheduled!',
        position: 'tr',
        duration: 5000,
      });
    } else {
      // used to display warnings if input invalid
      this.invalidSubmitted = true;
    }
  }

  ngOnInit() {
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((tenant) => {
          this.taskService
            .getLandlordIdByTenantId(tenant.id)
            .subscribe((landlordId) => {
              this.landlordId = landlordId;
            });
        });
    });
  }
}
