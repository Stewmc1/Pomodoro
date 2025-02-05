import { Component } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.css',
})
export class TimerComponent {
  timeLeft$: Observable<number>;

  constructor(public timerService: TimerService) {
    this.timeLeft$ = this.timerService.timeLeft$;
  }

  shortSesion() {
    this.timerService.setSessionDuration(25 * 60);
    this.timerService.startSession(25 * 60);
  }

  longSesion() {
    this.timerService.setSessionDuration(50 * 60);
    this.timerService.startSession(50 * 60);
  }

  stop() {
    this.timerService.stopTimer();
  }

  reset() {
    this.timerService.resetTimer();
  }

  formatTime(seconds: number | null): string {
    if (seconds === null) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  }
}
