import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NHL_API } from './nhl-api.config';
import { Team } from './nhl.models';
import { AppService } from '../../app.service';
import { DurationInMs } from '../../app.models';
@Injectable({
  providedIn: 'root',
})
export class NhlService {
  private readonly teamsSignal = signal<Team[]>([]);
  public readonly teams = this.teamsSignal.asReadonly();

  constructor(private http: HttpClient, private appService: AppService) {
    this.getTeams();
  }

  getStandings() {
    const url = NHL_API.STANDINGS.replace(
      'DATE',
      new Date().toISOString().slice(0, 10)
    );
    return this.appService.getWithCache(url, DurationInMs.ONE_MINUTE * 30);
  }

  getTeams() {
    this.getStandings().subscribe((data: any) => {
      const { standings } = data;
      if (standings && standings.length > 0) {
        const newTeams: Team[] = standings.map((standing: any) => {
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
    const url = NHL_API.SEASON_SCHEDULE.replace(
      'TEAM_ABBV',
      teamAbbrev
    ).replace('SEASON_ID', seasonId);
    return this.appService.getWithCache(url);
  }
}
