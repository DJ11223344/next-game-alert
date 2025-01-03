import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./shared/components/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'preferences',
    loadComponent: () =>
      import('./preferences/preferences.component').then(
        (m) => m.PreferencesComponent
      ),
  },
  {
    path: 'game',
    component: GameComponent,
    loadChildren: () => import('./game/game.routes').then((m) => m.routes),
  },
];
