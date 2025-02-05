import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerService } from '../services/timer.service';

@Component({
  selector: 'app-btn-start-stop',
  imports: [CommonModule],
  templateUrl: './btn-start-stop.component.html',
  styleUrl: './btn-start-stop.component.css',
})
export class BtnStartStopComponent {
  constructor(public timerService: TimerService) {}

  toggleTimer() {
    if (this.timerService.isTimerRunning) {
      this.timerService.stopTimer();
    } else {
      this.timerService.resumeTimer();
    }
  }

  reset() {
    this.timerService.resetTimer();
  }
}
