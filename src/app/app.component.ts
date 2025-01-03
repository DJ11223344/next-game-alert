import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { CountdownComponent } from './shared/components/countdown/countdown.component';
import { AlertControlsComponent } from './shared/components/alert-controls/alert-controls.component';
import { CacheService } from './shared/services/cache.service';
import { AppService } from './app.service';
import { Sport, Game } from './shared/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    AlertControlsComponent,
    CountdownComponent,
  ],
  providers: [AppService, CacheService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private appService: AppService,
    private cacheService: CacheService
  ) {}

  nextGame: Game | null = null;
  sport: Sport | null = null;

  ngOnInit() {
    const nextGame = this.appService.findNextGame();
    if (nextGame) {
      this.cacheService.cacheData(`${nextGame.sport}-next-game`, nextGame.game);
      this.appService.showNextGame(nextGame.game, nextGame.sport);
    }
  }
}
