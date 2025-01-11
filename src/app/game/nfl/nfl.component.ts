import { Component, OnDestroy } from '@angular/core';

import { CountdownService } from '../../shared/services/countdown.service';

@Component({
  selector: 'app-nfl',
  imports: [],
  templateUrl: './nfl.component.html',
  styleUrl: './nfl.component.scss',
})
export class NflComponent implements OnDestroy {
  constructor(private countdownService: CountdownService) {}

  ngOnDestroy(): void {
    this.countdownService.stopCountdown();
  }
}
