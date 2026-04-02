import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  category: string;
  priority: string;
  deadline?: string;
  taskType: 'personal' | 'team';
  team: string;
  owner: string;
  createdAt?: string;
  steps?: string[];
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks(username: string, team: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?username=${username}&team=${team}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}