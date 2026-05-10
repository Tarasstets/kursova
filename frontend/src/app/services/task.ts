import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Step {
  text: string;
  author: string;
}

export interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  category: string;
  priority: string;
  deadline?: string;
  taskType: 'personal' | 'shared';
  owner: string;
  createdAt?: string;
  steps?: Step[];
  notes?: string;
  sharedWith?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getTasks(username: string, role: string): Observable<Task[]> {
    return this.http.get<Task[]>(
      `${this.apiUrl}?username=${username}&role=${role}`,
      {
        headers: this.getHeaders()
      }
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(
      this.apiUrl,
      task,
      {
        headers: this.getHeaders()
      }
    );
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${this.apiUrl}/${id}`,
      task,
      {
        headers: this.getHeaders()
      }
    );
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }
}