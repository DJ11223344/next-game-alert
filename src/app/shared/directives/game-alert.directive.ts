import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { AppService } from '../../app.service';
import { UserPreferences } from '../../app.models';
@Directive({
  selector: '[gameAlert]',
  standalone: true,
})
export class GameAlertDirective implements OnChanges, OnDestroy {
  @Input() gameAlert = false;
  @Input() countdownSeconds = 5;
  @Output() gameAlertChange = new EventEmitter<boolean>();

  private timerInterval: any;
  private countdownElement: HTMLElement;
  private controlsElement: HTMLElement;
  private audio: HTMLAudioElement;
  private isMuted = false;
  private isPlaying = false;
  private userPreferences!: UserPreferences;
  private stopButton: HTMLElement;
  private volumeControl: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private appService: AppService
  ) {
    // Initialize user preferences
    this.userPreferences = this.appService.getUserPreferences();
    this.isMuted = this.userPreferences.isMuted;

    // Create countdown element
    this.countdownElement = this.renderer.createElement('div');
    this.renderer.addClass(this.countdownElement, 'game-alert-countdown');

    // Create controls element and add it immediately to the DOM
    this.controlsElement = this.renderer.createElement('div');
    this.renderer.addClass(this.controlsElement, 'game-alert-controls');
    this.renderer.appendChild(this.el.nativeElement, this.controlsElement);

    // Create stop button
    this.stopButton = this.renderer.createElement('button');
    this.renderer.setProperty(this.stopButton, 'textContent', '⏹️ Stop');
    this.renderer.addClass(this.stopButton, 'button');
    this.renderer.listen(this.stopButton, 'click', () => this.stopAlert());

    // Create mute button
    const muteButton = this.renderer.createElement('button');
    this.renderer.setProperty(
      muteButton,
      'textContent',
      this.isMuted ? '🔇 Unmute' : '🔊 Mute'
    );
    this.renderer.addClass(muteButton, 'button');
    this.renderer.listen(muteButton, 'click', () =>
      this.toggleMute(muteButton)
    );

    // Add buttons to controls
    this.renderer.appendChild(this.controlsElement, this.stopButton);
    this.renderer.appendChild(this.controlsElement, muteButton);

    // Initialize audio element
    this.audio = new Audio('/assets/audio/ESPN - National Hockey Night.mp3');
    this.audio.preload = 'auto';
    this.audio.muted = this.isMuted;

    // Add event listeners for audio
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.showControls();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.hideControlsIfNotActive();
    });

    // Create volume control
    this.volumeControl = this.renderer.createElement('input');
    this.renderer.setAttribute(this.volumeControl, 'type', 'range');
    this.renderer.setAttribute(this.volumeControl, 'min', '0');
    this.renderer.setAttribute(this.volumeControl, 'max', '1');
    this.renderer.setAttribute(this.volumeControl, 'step', '0.1');
    this.renderer.setAttribute(
      this.volumeControl,
      'value',
      this.userPreferences.volume?.toString() || '1'
    );
    this.renderer.addClass(this.volumeControl, 'game-alert-volume');

    // Set initial volume
    this.audio.volume = this.userPreferences.volume || 1;

    // Add volume change listener
    this.renderer.listen(this.volumeControl, 'input', (event) => {
      const volume = parseFloat(event.target.value);
      this.updateVolume(volume);
    });

    // Add volume control to controls
    this.renderer.appendChild(this.controlsElement, this.volumeControl);
  }

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'game-alert');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.gameAlert) {
      this.renderer.addClass(this.el.nativeElement, 'active');
      this.startCountdown();
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'active');
      this.stopCountdown();
    }
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  private startCountdown(): void {
    this.stopCountdown();

    this.renderer.appendChild(this.el.nativeElement, this.countdownElement);

    let timeLeft = this.countdownSeconds;
    this.updateCountdownText(timeLeft);

    this.timerInterval = setInterval(() => {
      timeLeft--;
      this.updateCountdownText(timeLeft);

      if (timeLeft <= 0) {
        this.stopCountdown();
        this.playGameStartSound();
        this.gameAlertChange.emit(false);
      }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.countdownElement.parentNode) {
      this.renderer.removeChild(this.el.nativeElement, this.countdownElement);
    }

    // Only remove controls if audio is not playing
    if (!this.isPlaying) {
      this.hideControlsIfNotActive();
    }
  }

  private hideControlsIfNotActive(): void {
    if (!this.gameAlert && !this.isPlaying) {
      if (this.stopButton.parentNode) {
        this.renderer.removeChild(this.controlsElement, this.stopButton);
      }
    }
  }

  private showControls(): void {
    // Only append stop button if it's not already there
    if (!this.stopButton.parentNode) {
      this.renderer.appendChild(this.controlsElement, this.stopButton);
    }
  }

  private stopAlert(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.hideControlsIfNotActive();
    this.gameAlertChange.emit(false);
  }

  private toggleMute(button: HTMLElement): void {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.userPreferences.isMuted = this.isMuted;
    this.appService.storeUserPreferences(this.userPreferences);
    this.renderer.setProperty(
      button,
      'textContent',
      this.isMuted ? '🔇 Unmute' : '🔊 Mute'
    );
  }

  private updateCountdownText(seconds: number): void {
    const text = `Game starting in ${seconds} seconds`;
    this.renderer.setProperty(this.countdownElement, 'textContent', text);
  }

  private async playGameStartSound(): Promise<void> {
    try {
      await this.audio.play();
    } catch (error) {
      console.warn('Could not play game start sound:', error);
    }
  }

  private updateVolume(volume: number): void {
    this.audio.volume = volume;
    this.userPreferences.volume = volume;
    this.appService.storeUserPreferences(this.userPreferences);
  }
}
