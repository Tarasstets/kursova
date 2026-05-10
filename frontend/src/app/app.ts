import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LanguageService } from './services/language.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    public authService: AuthService,
    private router: Router,
    public languageService: LanguageService
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get user() {
    return this.authService.getUser();
  }

   hideSidebar(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

}