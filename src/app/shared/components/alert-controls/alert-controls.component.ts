import { Component, effect, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertControlsService } from '../../services/alert-controls.service';

@Component({
  selector: 'app-alert-controls',
  templateUrl: './alert-controls.component.html',
  styleUrls: ['./alert-controls.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [AlertControlsService],
})
export class AlertControlsComponent {
  @Input() showControls = true;

  protected isMuted = false;
  protected volume = 1;
  protected audio: HTMLAudioElement | null = null;

  constructor(private alertControlsService: AlertControlsService) {
    effect(() => {
      this.isMuted = this.alertControlsService.isMuted();
      this.volume = this.alertControlsService.volume();
      this.audio = this.alertControlsService.audio();
    });
  }

  protected toggleMute(): void {
    this.alertControlsService.toggleMute();
  }

  protected updateVolume(event: Event): void {
    const volume = parseFloat((event.target as HTMLInputElement).value);
    this.alertControlsService.updateVolume(volume);
  }

  protected stopAudio(): void {
    this.alertControlsService.stopAudio();
  }
}
