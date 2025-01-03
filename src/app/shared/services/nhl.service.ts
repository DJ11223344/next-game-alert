import { Injectable, signal } from '@angular/core';

import { DurationInMs, NhlTeam, Sport } from '../../shared/models';
import { CacheService } from '../../shared/services/cache.service';
import { GameService } from './game.service';

export const NHL_LOGO_URL =
  'https://assets.nhle.com/logos/nhl/svg/NHL_light.svg';

export const NHL_API = {
  STANDINGS: `nhlapi/v1/standings/DATE`,
  SEASON_SCHEDULE: `nhlapi/v1/club-schedule-season/TEAM_ABBV/SEASON_ID`,
};

@Injectable({
  providedIn: 'root',
})
export class NhlService {
  readonly teamsSignal = signal<NhlTeam[]>([]);

  public readonly teams = this.teamsSignal.asReadonly();

  public readonly NHL_LOGO_URL = NHL_LOGO_URL;

  /**
   * NHL API
   *
   * Keywords:
   * - TEAM_ABBV: Team Abbreviation (e.g. "BOS")
   * - SEASON_ID: Season ID (e.g. "20242025") - This is the current season
   * - DATE: Date (e.g. "2024-12-29") - This is the date of the standings
   *
   * @see https://github.com/Zmalski/NHL-API-Reference?tab=readme-ov-file#schedule-1
   */
  public readonly NHL_API = NHL_API;

  constructor(
    private cacheService: CacheService,
    private gameService: GameService
  ) {
    this.getTeams();
  }

  getStandings() {
    const url = this.NHL_API.STANDINGS.replace(
      'DATE',
      new Date().toISOString().slice(0, 10)
    );
    return this.cacheService.getWithCache(url, DurationInMs.ONE_MINUTE * 30);
  }

  getTeams() {
    this.getStandings().subscribe((data: any) => {
      const { standings } = data;
      if (standings && standings.length > 0) {
        const newTeams: NhlTeam[] = standings.map((standing: any) => {
          const {
            teamAbbrev,
            teamCommonName,
            teamLogo,
            placeName,
            conferenceName,
            gamesPlayed,
            wins,
            losses,
            otLosses,
          } = standing;

          return {
            id: teamAbbrev.default,
            name: teamCommonName.default,
            location: placeName.default,
            conference: conferenceName,
            logo: teamLogo,
            record: {
              gamesPlayed,
              wins,
              losses,
              otl: otLosses,
            },
          };
        });
        this.teamsSignal.set(newTeams);
      }
    });
  }

  /**
   * Get the schedule for a team for a given season
   * @param teamAbbrev - The abbreviation of the team (e.g. "BOS")
   * @param seasonId - The season ID (e.g. "20242025")
   * @returns The schedule for the team for the given season
   */
  getSeasonSchedule(teamAbbrev: string, seasonId: string) {
    const url = this.NHL_API.SEASON_SCHEDULE.replace(
      'TEAM_ABBV',
      teamAbbrev
    ).replace('SEASON_ID', seasonId);
    return this.cacheService.getWithCache(url, DurationInMs.ONE_MINUTE * 30);
  }

  getNextGame(team: NhlTeam) {
    if (team && team.schedule && team.schedule.length > 0) {
      const futureGames = this.gameService.getFutureGames(team.schedule);
      if (futureGames.length > 0) {
        this.cacheService.cacheData(
          `${Sport.NHL}-next-game`,
          futureGames[0],
          DurationInMs.ONE_DAY
        );
        return futureGames[0];
      }
    }

    return null;
  }
}
