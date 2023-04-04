import { Component, OnInit } from '@angular/core';
import { CognitoService } from 'src/app/services/cognito.service';
import { LoginService } from 'src/app/services/login.service';
import { TaskService } from 'src/app/services/task.service';
import { Task } from '../../../models/task';

@Component({
  selector: 'app-landlord-tasks',
  templateUrl: './landlord-tasks.component.html',
  styleUrls: ['./landlord-tasks.component.css'],
})
export class LandlordTasksComponent implements OnInit {
  tasks: Task[] = [];
  userId: number = -1;
  isTaskLoaded = true;
  isTaskDeleteLoaded = false;

  constructor(
    private taskService: TaskService,
    private cognitoService: CognitoService,
    private loginService: LoginService
  ) {}

  setTasks(id: number) {
    this.userId = id;
    this.taskService.getAllActiveTasks(id).subscribe((response) => {
      this.tasks = response;
      this.sortTasks();
      this.isTaskLoaded = false;
      this.isTaskDeleteLoaded = false;
    });
  }

  sortTasks() {
    for (let task of this.tasks) {
      // split/clean date
      let splitDate: string[] = task.date.split('/');
      let month: number = +splitDate[0];
      let day: number = +splitDate[1];
      let year: number = +('20' + splitDate[2]);
      // split/clean time
      let splitTime = task.time.split(' ');
      let hour: number = +splitTime[0].split(':')[0];
      let minute: number = +splitTime[0].split(':')[1];
      if (splitTime[1] === 'PM') {
        hour += 12;
      }
      // add datetime attribute to sort by upcoming
      task.datetime = new Date(year, month, day, hour, minute);
    }
    this.tasks = this.tasks.sort(
      (a: any, b: any) => a.datetime.getTime() - b.datetime.getTime()
    );
  }

  deleteTask(task: Task) {
    this.isTaskDeleteLoaded = true;
    this.taskService.deleteTask(task).subscribe((response) => {
      console.log(response);
      this.setTasks(this.userId);
    });
  }

  ngOnInit(): void {
    this.cognitoService.getUserAttributes().then((val) => {
      this.loginService
        .getLogginUserInput(val.attributes.email)
        .subscribe((user) => {
          this.setTasks(user.id);
        });
    });
  }
}
