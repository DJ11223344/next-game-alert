import { Component, OnDestroy } from '@angular/core';

import { CountdownService } from '../../shared/services/countdown.service';

@Component({
  selector: 'app-nba',
  imports: [],
  templateUrl: './nba.component.html',
  styleUrl: './nba.component.scss',
})
export class NbaComponent implements OnDestroy {
  constructor(private countdownService: CountdownService) {}

  ngOnDestroy(): void {
    this.countdownService.stopCountdown();
  }
}
