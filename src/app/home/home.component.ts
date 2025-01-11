import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  roadmapItems = [
    'Live game stats for your selected team',
    'Multiple team selection support',
    'Customizable alert sounds for different events (goals, penalties, etc.)',
    'Team news and updates',
    'Player stats and information',
    'Historical game results',
    'Head-to-head team statistics',
    'Push notifications for mobile devices',
    'Calendar integration for game schedules',
    'Social sharing features',
  ];
}
