import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'nhl',
    pathMatch: 'full',
  },
  {
    path: 'nhl',
    loadComponent: () =>
      import('./sports/nhl/nhl.component').then((m) => m.NhlComponent),
    title: 'NHL',
  },
  {
    path: 'nfl',
    loadComponent: () =>
      import('./sports/nfl/nfl.component').then((m) => m.NflComponent),
    title: 'NFL',
  },
  {
    path: 'nba',
    loadComponent: () =>
      import('./sports/nba/nba.component').then((m) => m.NbaComponent),
    title: 'NBA',
  },
  {
    path: 'configuration',
    loadComponent: () =>
      import('./components/configuration/configuration.component').then(
        (m) => m.ConfigurationComponent
      ),
  },
];
