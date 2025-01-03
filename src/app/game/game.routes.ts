import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'nhl',
    loadComponent: () =>
      import('./nhl/nhl.component').then((m) => m.NhlComponent),
  },
  {
    path: 'nfl',
    loadComponent: () =>
      import('./nfl/nfl.component').then((m) => m.NflComponent),
  },
  {
    path: 'nba',
    loadComponent: () =>
      import('./nba/nba.component').then((m) => m.NbaComponent),
  },
];
