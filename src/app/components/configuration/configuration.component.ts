import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuration',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  // Configuration settings using signals for reactive state management
  private readonly themeSignal = signal<'light' | 'dark'>('light');
  private readonly languageSignal = signal<string>('en');

  public readonly theme = computed(() => this.themeSignal());
  public readonly language = computed(() => this.languageSignal());

  constructor() {}

  updateTheme(newTheme: 'light' | 'dark'): void {
    this.themeSignal.set(newTheme);
  }

  updateLanguage(event: Event): void {
    if (event.target instanceof HTMLSelectElement) {
      this.languageSignal.set(event.target.value);
    }
  }
}
