import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

interface TeamColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

@Component({
  selector: 'app-game',
  imports: [RouterModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {}
