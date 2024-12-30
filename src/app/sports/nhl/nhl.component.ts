import { Component, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NhlService } from './nhl.service';
import { Team, Game } from './nhl.models';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { AppService } from '../../app.service';
import { UserPreferences } from '../../app.models';

@Component({
  selector: 'app-nhl',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  providers: [NhlService, AppService],
  templateUrl: './nhl.component.html',
  styleUrl: './nhl.component.scss',
})
export class NhlComponent {
  selectedTeam!: Team | null;

  teams: Team[] = [];

  isDropdownOpen = false;

  nextGame: Game | null = null;

  private userPreferences!: UserPreferences;

  private teamSchedule: Game[] = [];

  constructor(private nhlService: NhlService, private appService: AppService) {
    this.userPreferences = this.appService.getUserPreferences();

    effect(() => {
      this.teams = this.nhlService
        .teams()
        .sort((a, b) => a.location.localeCompare(b.location));

      if (this.userPreferences?.selectedTeam?.nhl?.id) {
        this.selectedTeam = this.findTeam(
          this.userPreferences.selectedTeam.nhl.id as string
        ) as Team;
        this.getTeamSchedule(this.selectedTeam.id, '20242025');
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  findTeam(teamId: string): Team | null {
    return this.teams.find((team) => team.id === teamId) as Team;
  }

  selectTeam(team: Team | null): void {
    this.selectedTeam = team;
    this.isDropdownOpen = false;
    if (team) {
      this.userPreferences.selectedTeam.nhl = { id: team.id, name: team.name };
      this.getTeamSchedule(team.id, '20242025'); // TODO: Get the current season ID
    } else {
      this.userPreferences.selectedTeam.nhl = null;
    }
    this.appService.storeUserPreferences(this.userPreferences);
  }

  getTeamSchedule(teamAbbrev: string, seasonId: string): void {
    this.nhlService
      .getSeasonSchedule(teamAbbrev, seasonId)
      .subscribe((data: any) => {
        const { games } = data;
        this.teamSchedule = games.map((game: any) => {
          return {
            id: game.id,
            date: game.gameDate,
            timeUTC: game.startTimeUTC,
            homeTeam: this.findTeam(game.homeTeam.abbrev),
            awayTeam: this.findTeam(game.awayTeam.abbrev),
            venue: game.venue.default,
          };
        });

        if (this.userPreferences.selectedTeam.nhl) {
          this.userPreferences.selectedTeam.nhl.schedule = this.teamSchedule;
          this.appService.storeUserPreferences(this.userPreferences);
        }

        this.findNextGame();
      });
  }

  findNextGame(): void {
    const now = new Date();

    // Find all future games and sort them chronologically
    const futureGames = this.teamSchedule
      .filter((game) => new Date(game.timeUTC) > now)
      .sort(
        (a, b) => new Date(a.timeUTC).getTime() - new Date(b.timeUTC).getTime()
      );

    // Get the first game from the sorted array
    this.nextGame = futureGames.length > 0 ? futureGames[0] : null;
  }
}
