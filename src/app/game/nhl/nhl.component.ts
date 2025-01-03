import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { DurationInMs, NhlGame, NhlTeam, Sport } from '../../shared/models';
import { CacheService } from '../../shared/services/cache.service';
import { CountdownService } from '../../shared/services/countdown.service';
import { NhlService } from '../../shared/services/nhl.service';
import { UserService } from '../../shared/services/user.service';
import { GameService } from '../../shared/services/game.service';
import { DropDownComponent } from '../../shared/components/drop-down/drop-down.component';

@Component({
  selector: 'app-nhl',
  standalone: true,
  imports: [CommonModule, DropDownComponent],
  providers: [CacheService],
  templateUrl: './nhl.component.html',
  styleUrl: './nhl.component.scss',
})
export class NhlComponent {
  protected game!: NhlGame;

  protected alert: boolean = false;

  protected teams: NhlTeam[] = [];

  protected teamSchedule: NhlGame[] = [];

  protected selectedTeam!: NhlTeam;

  constructor(
    private cacheService: CacheService,
    private countdownService: CountdownService,
    private nhlService: NhlService,
    private userService: UserService,
    private gameService: GameService,
    private router: Router
  ) {
    effect(() => {
      if (this.countdownService.timeLeft() < DurationInMs.ONE_MINUTE * 15) {
        this.alert = true;
      }

      if (this.countdownService.timeLeft() < 1) {
        this.alert = false;
      }
    });

    effect(() => {
      this.teams = this.nhlService
        .teams()
        .sort((a, b) => a.location.localeCompare(b.location));

      this.game = this.cacheService.getCachedData<NhlGame>(
        `${Sport.NHL}-next-game`
      ) as NhlGame;

      if (this.game) {
        this.loadGame(this.game);
      }
    });

    this.selectedTeam = this.userService.getSelectedTeam(Sport.NHL) as NhlTeam;
  }

  ngOnInit() {
    if (this.router?.lastSuccessfulNavigation?.extras?.state?.['game']) {
      this.loadGame(
        this.router.lastSuccessfulNavigation.extras.state['game'] as NhlGame
      );
    }
  }

  findTeam(teamId: string): NhlTeam | null {
    return this.teams.find((team) => team.id === teamId) as NhlTeam;
  }

  selectTeam(team: NhlTeam): void {
    this.selectedTeam = team as NhlTeam;
    this.getTeamSchedule(team, '20242025'); // TODO: Get the current season ID
  }

  getTeamSchedule(team: NhlTeam, seasonId: string): void {
    this.nhlService
      .getSeasonSchedule(team.id as string, seasonId)
      .subscribe((data: any) => {
        const { games } = data;
        this.teamSchedule = games.map((game: any) => {
          return {
            id: game.id,
            date: game.gameDate,
            timeUTC: game.startTimeUTC,
            homeTeamId: game.homeTeam.abbrev,
            awayTeamId: game.awayTeam.abbrev,
            venue: game.venue.default,
          };
        });

        const teamToStore = {
          ...team,
          schedule: this.teamSchedule,
        };

        this.userService.storeSelectedTeam(Sport.NHL, teamToStore);

        const futureGames = this.gameService.getFutureGames(this.teamSchedule);

        if (futureGames.length > 0) {
          this.loadGame(futureGames[0]);
          this.cacheService.cacheData(
            `${Sport.NHL}-next-game`,
            futureGames[0],
            DurationInMs.ONE_DAY
          );
        }
      });
  }

  private loadGame(game: NhlGame): void {
    this.game = game;
    this.game.homeTeam = this.findTeam(this.game.homeTeamId) as NhlTeam;
    this.game.awayTeam = this.findTeam(this.game.awayTeamId) as NhlTeam;
    this.countdownService.startCountdown(new Date(this.game.timeUTC));
  }
}
