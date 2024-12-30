import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface CacheEntry {
  url: string;
  response: any;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private CACHE_KEY = 'http_cache';
  private CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

  get(url: string): Observable<HttpResponse<any>> | null {
    const cached = this.getFromStorage();
    const entry = cached.find((e) => e.url === url);

    if (!entry) {
      return null;
    }

    // Check if cache is expired
    if (Date.now() - entry.timestamp > this.CACHE_EXPIRY) {
      this.remove(url);
      return null;
    }

    return of(new HttpResponse(entry.response));
  }

  set(url: string, response: HttpResponse<any>): void {
    const cached = this.getFromStorage();
    const entry: CacheEntry = {
      url,
      response: {
        body: response.body,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      },
      timestamp: Date.now(),
    };

    const index = cached.findIndex((e) => e.url === url);
    if (index !== -1) {
      cached[index] = entry;
    } else {
      cached.push(entry);
    }

    localStorage.setItem(this.CACHE_KEY, JSON.stringify(cached));
  }

  remove(url: string): void {
    const cached = this.getFromStorage();
    const filtered = cached.filter((e) => e.url !== url);
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(filtered));
  }

  clear(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  private getFromStorage(): CacheEntry[] {
    const cached = localStorage.getItem(this.CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  }
}
