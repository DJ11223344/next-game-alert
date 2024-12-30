import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserPreferences, CacheEntry } from './app.models';
import { DurationInMs } from './app.models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly CACHE_DURATION = DurationInMs.ONE_MINUTE;
  private readonly CACHE_PREFIX = 'app_cache_';

  constructor(private http: HttpClient) {}

  private getCacheKey(url: string): string {
    return this.CACHE_PREFIX + btoa(url);
  }

  storeUserPreferences(preferences: UserPreferences): void {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }

  getUserPreferences(): UserPreferences {
    const preferences = localStorage.getItem('userPreferences');
    return preferences
      ? JSON.parse(preferences)
      : { isMuted: false, selectedTeam: { nhl: null, nba: null, nfl: null } };
  }

  getCachedData<T>(url: string): Observable<T> | null {
    const cacheKey = this.getCacheKey(url);
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const entry: CacheEntry = JSON.parse(cached);
      if (entry.expiresAt > Date.now()) {
        return of(entry.data);
      } else {
        // Clean up expired cache entry
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  cacheData(
    url: string,
    data: any,
    duration: number = this.CACHE_DURATION
  ): void {
    const cacheKey = this.getCacheKey(url);
    const entry: CacheEntry = {
      expiresAt: Date.now() + duration,
      data,
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  }

  getWithCache<T>(
    url: string,
    duration: number = this.CACHE_DURATION
  ): Observable<T> {
    const cached = this.getCachedData<T>(url);
    if (cached) {
      return cached;
    }

    return new Observable<T>((observer) => {
      this.http.get<T>(url).subscribe({
        next: (data) => {
          this.cacheData(url, data, duration);
          observer.next(data);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }
}
