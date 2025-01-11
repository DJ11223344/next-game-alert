import { Component, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CountdownService } from '../../services/countdown.service';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [],
})
export class CountdownComponent implements OnDestroy {
  years: number = 0;
  months: number = 0;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  protected isActive = true;

  constructor(private countdownService: CountdownService) {
    effect(() => {
      this.years = this.countdownService.years();
      this.months = this.countdownService.months();
      this.days = this.countdownService.days();
      this.hours = this.countdownService.hours();
      this.minutes = this.countdownService.minutes();
      this.seconds = this.countdownService.seconds();
      this.isActive = this.countdownService.isActive();
    });
  }

  ngOnDestroy(): void {
    this.countdownService.stopCountdown();
  }
}
