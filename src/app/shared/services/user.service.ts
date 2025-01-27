import { Injectable, signal } from '@angular/core';

import {
  DurationInMs,
  UserPreferences,
  Sport,
  NhlTeam,
  NflTeam,
  NbaTeam,
} from '../models';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _preferences = signal<UserPreferences | null>(null);

  public readonly preferences = this._preferences.asReadonly();

  constructor(private cacheService: CacheService) {
    this.getUserPreferences();
  }

  storeUserPreferences(preferences: UserPreferences): void {
    this._preferences.set(preferences);
    this.cacheService.cacheData(
      'user-preferences',
      preferences,
      DurationInMs.ONE_YEAR
    );
  }

  getUserPreferences(): UserPreferences {
    let preferences =
      this.cacheService.getCachedData<UserPreferences>('user-preferences');

    if (!preferences) {
      preferences = {
        isMuted: false,
        volume: 1,
        alertEnabled: true,
        reminderStart: '15',
      };
      this._preferences.set(preferences);
    }

    return preferences;
  }

  storeSelectedTeam(
    sport: Sport,
    selectedTeam: NhlTeam | NflTeam | NbaTeam
  ): void {
    this.cacheService.cacheData(
      `${sport}-selected-team`,
      selectedTeam,
      DurationInMs.ONE_HOUR * 6
    );
  }

  getSelectedTeam(sport: Sport): NhlTeam | NflTeam | NbaTeam | null {
    return this.cacheService.getCachedData<NhlTeam | NflTeam | NbaTeam>(
      `${sport}-selected-team`
    );
  }
}
