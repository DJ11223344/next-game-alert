import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  years = signal(0);
  months = signal(0);
  days = signal(0);
  hours = signal(0);
  minutes = signal(0);
  seconds = signal(0);
  timeLeft = signal(0);
  isActive = signal(false);

  private endDate: Date = new Date();
  private timerInterval: any;

  constructor() {}

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  startCountdown(endDate: Date): void {
    this.endDate = new Date(endDate);
    this.stopCountdown();
    this.isActive.set(true);

    this.timerInterval = setInterval(() => {
      this.updateCountdown();

      if (this.timeLeft() <= 0) {
        this.stopCountdown();
      }
    }, 100);
  }

  private updateCountdown(): void {
    this.timeLeft.set(this.endDate.getTime() - new Date().getTime());
    this.years.set(Math.floor(this.timeLeft() / (1000 * 60 * 60 * 24 * 365)));
    this.months.set(Math.floor(this.timeLeft() / (1000 * 60 * 60 * 24 * 30)));
    this.days.set(Math.floor(this.timeLeft() / (1000 * 60 * 60 * 24)));
    this.hours.set(
      Math.floor((this.timeLeft() % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    this.minutes.set(
      Math.floor((this.timeLeft() % (1000 * 60 * 60)) / (1000 * 60))
    );
    this.seconds.set(Math.floor((this.timeLeft() % (1000 * 60)) / 1000));
  }

  public stopCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isActive.set(false);

    this.years.set(0);
    this.months.set(0);
    this.days.set(0);
    this.hours.set(0);
    this.minutes.set(0);
    this.seconds.set(0);
    this.timeLeft.set(0);
  }
}
