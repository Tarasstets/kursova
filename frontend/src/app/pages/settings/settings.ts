import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LanguageService, AppLanguage } from '../../services/language.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent implements OnInit {
  currentUser: any = null;
  isDarkMode = false;
  selectedLanguage: AppLanguage = 'en';

  constructor(public languageService: LanguageService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (user) {
      this.currentUser = JSON.parse(user);
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    this.isDarkMode = savedDarkMode === 'true';

    if (this.isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }

    this.selectedLanguage = this.languageService.getLanguage();
  }

  toggleDarkMode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.isDarkMode = input.checked;

    if (this.isDarkMode) {
      document.body.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }

  changeLanguage(language: AppLanguage): void {
    this.selectedLanguage = language;
    this.languageService.setLanguage(language);
  }
}