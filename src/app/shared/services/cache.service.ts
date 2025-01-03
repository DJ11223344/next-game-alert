import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CacheEntry, DurationInMs } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private readonly CACHE_DURATION = DurationInMs.ONE_MINUTE;
  private readonly CACHE_PREFIX = 'app-cache-';

  constructor(private http: HttpClient) {}

  private getCacheKey(key: string): string {
    return this.CACHE_PREFIX + (isDevMode() ? key : btoa(key));
  }

  getCachedData<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const entry: CacheEntry = JSON.parse(cached);
      if (entry.expiresAt > Date.now()) {
        return entry.data;
      } else {
        // Clean up expired cache entry
        localStorage.removeItem(cacheKey);
      }
    }
    return null;
  }

  cacheData(
    key: string,
    data: any,
    duration: number = this.CACHE_DURATION
  ): void {
    const cacheKey = this.getCacheKey(key);
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
      return of(cached);
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
