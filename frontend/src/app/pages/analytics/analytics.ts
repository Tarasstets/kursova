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
    labels: ['Навчання', 'Робота', 'Особисте'],
    datasets: [{ data: [0, 0, 0] }]
  };

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Активні', 'Виконані'],
    datasets: [{ label: 'Кількість задач', data: [0, 0] }]
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

    this.taskService
      .getTasks(this.currentUser.username, this.currentUser.team)
      .subscribe({
        next: (data) => {
          this.ngZone.run(() => {
            this.tasks = data;
            this.totalTasks = data.length;
            this.activeTasks = data.filter(task => !task.completed).length;
            this.completedTasks = data.filter(task => task.completed).length;

            const studyCount = data.filter(task => task.category === 'Навчання').length;
            const workCount = data.filter(task => task.category === 'Робота').length;
            const personalCount = data.filter(task => task.category === 'Особисте').length;

            this.pieChartData = {
              labels: ['Навчання', 'Робота', 'Особисте'],
              datasets: [{ data: [studyCount, workCount, personalCount] }]
            };

            this.barChartData = {
              labels: ['Активні', 'Виконані'],
              datasets: [
                {
                  label: 'Кількість задач',
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