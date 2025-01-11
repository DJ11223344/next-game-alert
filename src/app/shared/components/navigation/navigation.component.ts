import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AlertControlsComponent } from '../alert-controls/alert-controls.component';
import { NHL_LOGO_URL } from '../../services/nhl.service';
import { NFL_LOGO_URL } from '../../services/nfl.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-navigation',
  imports: [
    RouterLink,
    RouterLinkActive,
    AlertControlsComponent,
    LogoComponent,
  ],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  nhlLogoUrl = NHL_LOGO_URL;
  nflLogoUrl = NFL_LOGO_URL;
}
