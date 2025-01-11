export interface Game {
  id: string;
  date: string;
  timeUTC: string;
  homeTeamId: string;
  awayTeamId: string;
  venue: string;
}

export interface Record {
  gamesPlayed: number;
  wins: number;
  losses: number;
}

export enum Sport {
  NHL = 'nhl',
  NFL = 'nfl',
  NBA = 'nba',
}

export interface Team {
  id: string | number;
  name: string;
  location?: string;
  record?: Record;
  schedule?: Game[];
}

export interface TeamSchedule {
  nextGame: any;
}

export interface TeamColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

// Specific to NHL
export interface NhlRecord extends Record {
  ties?: number;
  otl?: number;
}

export interface NhlTeam extends Team {
  location: string;
  conference: string;
  logo: string;
  record: NhlRecord;
}

export interface NhlGame extends Game {
  homeTeamId: string;
  awayTeamId: string;
  homeTeam?: NhlTeam;
  awayTeam?: NhlTeam;
}

// Specific to NFL
export interface NflTeam extends Team {
  todo: string;
}

// Specific to NBA
export interface NbaTeam extends Team {
  todo: string;
}
