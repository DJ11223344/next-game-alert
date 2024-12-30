import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameAlertDirective } from './shared/directives/game-alert.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GameAlertDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  shouldShowGameAlert = false;

  toggleGameAlert() {
    this.shouldShowGameAlert = !this.shouldShowGameAlert;
  }

  onGameAlertChange(value: boolean) {
    this.shouldShowGameAlert = value;
  }
}
