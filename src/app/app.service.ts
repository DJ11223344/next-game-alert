import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { NhlService } from './shared/services/nhl.service';
import { CacheService } from './shared/services/cache.service';
import { UserService } from './shared/services/user.service';
import { GameService } from './shared/services/game.service';
import { Sport, Game, DurationInMs, NhlTeam } from './shared/models';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(
    private cacheService: CacheService,
    private userService: UserService,
    private router: Router,
    private nhlService: NhlService,
    private gameService: GameService
  ) {}

  findNextGame(): { game: Game; sport: Sport } | null {
    const selectedTeam = {
      nhl: this.userService.getSelectedTeam(Sport.NHL),
      nfl: this.userService.getSelectedTeam(Sport.NFL),
      nba: this.userService.getSelectedTeam(Sport.NBA),
    };
    let nextGame: Game | null = null;
    let nextGameSport: Sport | null = null;

    // Check NHL games
    if (selectedTeam.nhl) {
      const earliestNHLGame = this.nhlService.getNextGame(
        selectedTeam.nhl as NhlTeam
      );

      if (
        !nextGame ||
        (earliestNHLGame &&
          new Date(earliestNHLGame.timeUTC) <
            new Date((nextGame as Game).timeUTC))
      ) {
        nextGame = earliestNHLGame;
        this.cacheService.cacheData(
          `${Sport.NHL}-next-game`,
          nextGame,
          DurationInMs.ONE_DAY
        );
      }
    }

    // Check NFL games
    if (
      selectedTeam.nfl &&
      selectedTeam.nfl.schedule &&
      selectedTeam.nfl.schedule.length > 0
    ) {
      const futureGames = this.gameService.getFutureGames(
        selectedTeam.nfl.schedule
      );
      if (futureGames.length > 0) {
        nextGameSport = Sport.NFL;
        const earliestNFL = futureGames[0];
        if (
          !nextGame ||
          new Date(earliestNFL.timeUTC) < new Date((nextGame as Game).timeUTC)
        ) {
          nextGame = earliestNFL;
          this.cacheService.cacheData(
            `${Sport.NFL}-next-game`,
            nextGame,
            DurationInMs.ONE_DAY
          );
        }
      }
    }

    if (nextGame && nextGameSport) {
      return { game: nextGame, sport: nextGameSport };
    }

    return null;
  }

  showNextGame(game: Game, sport: Sport) {
    this.router.navigate(['game', sport], { state: { game } });
  }
}
