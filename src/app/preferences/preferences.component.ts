import { Component } from '@angular/core';

import { UserPreferences } from '../shared/models';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-preferences',
  imports: [],
  providers: [UserService],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
})
export class PreferencesComponent {
  userPreferences: UserPreferences = {
    isMuted: false,
    volume: 1,
    alertEnabled: true,
    reminderStart: '15',
  };

  constructor(private userService: UserService) {}
}
