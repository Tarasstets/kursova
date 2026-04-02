import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register(): void {
    console.log('CLICK');
    
    if (!this.username || !this.password) return;

    this.authService.register(this.username, this.password)
      .subscribe({
        next: () => {
          alert('OK');
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

    goToLogin(): void {
    this.router.navigate(['/login']);
  }
}