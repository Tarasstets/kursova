import { Injectable } from '@angular/core';

export type AppLanguage = 'en' | 'ua';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private storageKey = 'language';

  currentLanguage: AppLanguage =
    (localStorage.getItem(this.storageKey) as AppLanguage) || 'en';

  setLanguage(language: AppLanguage): void {
    this.currentLanguage = language;
    localStorage.setItem(this.storageKey, language);
  }

  getLanguage(): AppLanguage {
    return this.currentLanguage;
  }
}