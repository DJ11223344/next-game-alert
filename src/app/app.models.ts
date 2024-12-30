import { Game } from './sports/nhl/nhl.models';

export interface Team {
  id: string | number;
  name: string;
  schedule?: Game[];
}

export interface UserPreferences {
  isMuted: boolean;
  volume?: number;
  selectedTeam: {
    nhl: Team | null;
    nba: Team | null;
    nfl: Team | null;
  };
}

export interface CacheEntry {
  expiresAt: number;
  data: any;
}

export enum DurationInMs {
  ONE_MINUTE = 1000 * 60,
  ONE_HOUR = 1000 * 60 * 60,
  ONE_DAY = 1000 * 60 * 60 * 24,
  ONE_WEEK = 1000 * 60 * 60 * 24 * 7,
  ONE_MONTH = 1000 * 60 * 60 * 24 * 30,
  ONE_YEAR = 1000 * 60 * 60 * 24 * 365,
}
