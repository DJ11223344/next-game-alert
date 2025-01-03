export interface CacheEntry {
  expiresAt: number;
  data: any;
}

export enum DurationInMs {
  ONE_SECOND = 1000,
  ONE_MINUTE = 1000 * 60,
  ONE_HOUR = 1000 * 60 * 60,
  ONE_DAY = 1000 * 60 * 60 * 24,
  ONE_WEEK = 1000 * 60 * 60 * 24 * 7,
  ONE_MONTH = 1000 * 60 * 60 * 24 * 30,
  ONE_YEAR = 1000 * 60 * 60 * 24 * 365,
}
