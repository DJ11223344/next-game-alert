import { Injectable } from '@angular/core';

import { Game } from '../models';
@Injectable({
  providedIn: 'root',
})
export class GameService {
  constructor() {}

  getFutureGames(schedule: Game[]) {
    const now = new Date();
    return schedule
      .filter((game) => new Date(game.timeUTC) > now)
      .sort(
        (a, b) => new Date(a.timeUTC).getTime() - new Date(b.timeUTC).getTime()
      );
  }
}
