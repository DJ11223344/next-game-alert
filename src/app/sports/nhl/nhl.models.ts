export interface Team {
  id: string; // Team Abbreviation
  location: string;
  name: string;
  conference: string;
  logo: string;
  record: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    otl: number;
  };
}

export interface TeamSchedule {
  nextGame: any;
}

export interface Game {
  id: string;
  date: string;
  timeUTC: string;
  homeTeam: Team;
  awayTeam: Team;
  venue: string;
}
