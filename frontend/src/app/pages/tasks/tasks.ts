import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { Task, TaskService } from '../../services/task';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, DatePipe],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css'
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  newStepText = '';

  newTaskTitle = '';
  newTaskCategory = 'Learning';
  newTaskPriority: 'low' | 'medium' | 'high' = 'medium';
  newTaskDeadline = '';
  newTaskType: 'personal' | 'shared' = 'personal';
  newTaskAssignee = '';

  filterCategory = 'All';
  showCompleted = false;

  currentUser: any = null;

  selectedTask: Task | null = null;
  isSidebarOpen = false;

  completeSound = new Audio('/sounds/complete.wav');

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.loadTasks();
    this.completeSound.volume = 1;
    this.completeSound.load();
  }

  loadTasks(): void {
  if (!this.currentUser) return;

  this.taskService
    .getTasks(this.currentUser.username, this.currentUser.role)
    .subscribe(data => {
      this.tasks = data;
      this.cdr.detectChanges();

      if (this.selectedTask?._id) {
        const updatedSelectedTask = this.tasks.find(
          t => t._id === this.selectedTask?._id
        );
        this.selectedTask = updatedSelectedTask || null;
      }
    });
}

  addTask(): void {
    if (!this.newTaskTitle.trim() || !this.currentUser) return;

    const sharedUsers =
      this.newTaskType === 'shared' && this.newTaskAssignee.trim()
        ? [this.newTaskAssignee.trim()]
        : [];

    const task: Task = {
      title: this.newTaskTitle,
      completed: false,
      category: this.newTaskCategory,
      priority: this.newTaskPriority,
      deadline: this.newTaskDeadline || undefined,
      taskType: this.newTaskType,
      owner: this.currentUser.username,
      sharedWith: sharedUsers,
      steps: [],
      notes: ''
    };

    this.taskService.addTask(task).subscribe(() => {
      this.newTaskTitle = '';
      this.newTaskCategory = 'Learning';
      this.newTaskPriority = 'medium';
      this.newTaskDeadline = '';
      this.newTaskType = 'personal';
      this.newTaskAssignee = '';
      this.loadTasks();
    });
  }

  playCompleteSound(): void {
    const audio = new Audio('/sounds/complete.wav');
    audio.volume = 1;
    audio.play().catch(err => {
      console.log('Error playing sound:', err);
    });
  }

  toggleTask(task: Task): void {
    if (!task._id) return;

    const newCompleted = !task.completed;

    this.tasks = this.tasks.map(t =>
      t._id === task._id ? { ...t, completed: newCompleted } : t
    );

    if (this.selectedTask?._id === task._id) {
      this.selectedTask = {
        ...this.selectedTask,
        completed: newCompleted
      };
    }

    if (newCompleted) {
      this.playCompleteSound();
    }

    const updatedTask: Task = {
      ...task,
      completed: newCompleted
    };

    this.taskService.updateTask(task._id, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: () => this.loadTasks()
    });
  }

  deleteTask(id?: string): void {
    if (!id) return;

    this.taskService.deleteTask(id).subscribe(() => {
      if (this.selectedTask?._id === id) {
        this.closeSidebar();
      }
      this.loadTasks();
    });
  }

  addStep(): void {
    if (!this.selectedTask || !this.selectedTask._id || !this.newStepText.trim()) return;

    const normalizedSteps = this.normalizeSteps(this.selectedTask.steps || []);

    const newStep = {
      text: this.newStepText.trim(),
      author: this.currentUser.username
    };

    const updatedSteps = [...normalizedSteps, newStep];

    const updatedTask: Task = {
      ...this.selectedTask,
      steps: updatedSteps
    };

    this.selectedTask = updatedTask;
    this.newStepText = '';

    this.tasks = this.tasks.map(t =>
      t._id === updatedTask._id ? { ...t, steps: updatedSteps } : t
    );

    this.taskService.updateTask(updatedTask._id!, updatedTask).subscribe({
      next: (serverTask: Task) => {
        this.selectedTask = serverTask;
        this.loadTasks();
      },
      error: (err) => {
        console.log('STEP SAVE ERROR:', err);
        this.loadTasks();
      }
    });
  }
  removeStep(index: number): void {
    if (!this.selectedTask || !this.selectedTask._id || !this.selectedTask.steps) return;

    const normalizedSteps = this.normalizeSteps(this.selectedTask.steps);

    const updatedSteps = normalizedSteps.filter((_, i) => i !== index);

    const updatedTask: Task = {
      ...this.selectedTask,
      steps: updatedSteps
    };

    this.selectedTask = updatedTask;

    this.tasks = this.tasks.map(t =>
      t._id === updatedTask._id ? { ...t, steps: updatedSteps } : t
    );

    this.taskService.updateTask(updatedTask._id!, updatedTask).subscribe({
      next: (serverTask: Task) => {
        this.selectedTask = serverTask;
        this.loadTasks();
      },
      error: (err) => {
        console.log('REMOVE STEP ERROR:', err);
        this.loadTasks();
      }
    });
  }

  normalizeSteps(steps: any[] = []) {
    return steps.map((step: any) =>
      typeof step === 'string'
        ? { text: step, author: 'unknown' }
        : step
    );
  }

  saveNotes(): void {
    if (!this.selectedTask || !this.selectedTask._id) return;

    const updatedTask: Task = {
      ...this.selectedTask,
      steps: this.normalizeSteps(this.selectedTask.steps || [])
    };

    this.tasks = this.tasks.map(t =>
      t._id === updatedTask._id ? { ...t, notes: updatedTask.notes, steps: updatedTask.steps } : t
    );

    this.taskService.updateTask(updatedTask._id!, updatedTask).subscribe({
      next: (serverTask: Task) => {
        this.selectedTask = serverTask;
        this.loadTasks();
      },
      error: (err) => {
        console.log('NOTES SAVE ERROR:', err);
        this.loadTasks();
      }
    });
  }

  openTaskDetails(task: Task): void {
    this.selectedTask = {
      ...task,
      steps: task.steps || [],
      notes: task.notes || ''
    };
    this.isSidebarOpen = true;
    this.newStepText = '';
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    this.selectedTask = null;
    this.newStepText = '';
  }

  getPriorityLabel(priority: string): string {
    if (priority === 'high') return 'High';
    if (priority === 'medium') return 'Medium';
    return 'Low';
  }

  getTaskTypeLabel(taskType?: string): string {
    return taskType === 'shared' ? 'Shared' : 'Personal';
  }

  get activeTasks(): Task[] {
    return this.tasks.filter(task => {
      const categoryMatch =
        this.filterCategory === 'All' || task.category === this.filterCategory;

      return categoryMatch && !task.completed;
    });
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => {
      const categoryMatch =
        this.filterCategory === 'All' || task.category === this.filterCategory;

      return categoryMatch && task.completed;
    });
  }
}