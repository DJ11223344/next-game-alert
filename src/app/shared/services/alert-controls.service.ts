import { Injectable, signal, effect } from '@angular/core';

import { UserService } from './user.service';
import { UserPreferences } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AlertControlsService {
  private userPreferences!: UserPreferences;

  isMuted = signal(false);
  volume = signal(1);
  audio = signal<HTMLAudioElement | null>(null);

  constructor(private userService: UserService) {
    effect(() => {
      const userPreferences = this.userService.preferences();

      if (userPreferences) {
        this.userPreferences = userPreferences;
        this.isMuted.set(!!this.userPreferences.isMuted);
        this.volume.set(this.userPreferences.volume || 1);
      }
    });
  }

  toggleMute(): void {
    this.isMuted.set(!this.isMuted());
    this.userPreferences.isMuted = this.isMuted();
    this.userService.storeUserPreferences(this.userPreferences);
  }

  updateVolume(volume: number): void {
    this.userPreferences.volume = volume;
    this.userService.storeUserPreferences(this.userPreferences);
    this.volume.set(volume);
  }

  stopAudio(): void {
    if (this.audio() && this.audio() instanceof HTMLAudioElement) {
      this.audio.update((el: HTMLAudioElement | null) => {
        if (el) {
          el.pause();
          el.currentTime = 0;
        }
        return el;
      });
    }
  }
}
