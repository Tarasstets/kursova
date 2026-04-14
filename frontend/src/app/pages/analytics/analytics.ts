import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { Task, TaskService } from '../../services/task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class AnalyticsComponent implements OnInit {
  tasks: Task[] = [];

  totalTasks = 0;
  completedTasks = 0;
  activeTasks = 0;

  pieChartType: ChartType = 'pie';
  barChartType: ChartType = 'bar';

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Learning', 'Робота', 'Особисте'],
    datasets: [{ data: [0, 0, 0] }]
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Active', 'Completed'],
    datasets: [{ label: 'Tasks Count', data: [0, 0] }]
  };

  currentUser: any = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    if (!this.currentUser) return;

    this.taskService.getTasks(this.currentUser.username).subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.tasks = data;
          this.totalTasks = data.length;
          this.activeTasks = data.filter(task => !task.completed).length;
          this.completedTasks = data.filter(task => task.completed).length;

          const studyCount = data.filter(task => task.category === 'Learning').length;
const workCount = data.filter(task => task.category === 'Work').length;
const personalCount = data.filter(task => task.category === 'Personal').length;

this.pieChartData = {
  labels: ['Learning', 'Work', 'Personal'],
  datasets: [{ data: [studyCount, workCount, personalCount] }]
};

          this.barChartData = {
            labels: ['Active', 'Completed'],
            datasets: [
              {
                label: 'Tasks Count',
                data: [this.activeTasks, this.completedTasks]
              }
            ]
          };

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('ANALYTICS ERROR:', err);
      }
    });
  }
}