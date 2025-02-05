import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timer$: Subscription | null = null;
  private timeLeft = new BehaviorSubject<number>(25 * 60);
  timeLeft$ = this.timeLeft.asObservable();
  private sessionCount = 0;
  sessionDuration = 0;
  isTimerRunning = false;
  isPaused = false;

  setSessionDuration(duration: number) {
    this.sessionDuration = duration;
    this.timeLeft.next(duration);
  }

  startSession(duration: number) {
    this.stopTimer();
    this.timeLeft.next(duration);
    this.isTimerRunning = true;
    this.isPaused = false;

    this.timer$ = interval(1000).subscribe(() => {
      if (this.timeLeft.value > 0) {
        this.timeLeft.next(this.timeLeft.value - 1);
      } else {
        this.handleBreak();
      }
    });
  }

  shortSesion() {
    this.stopTimer();
    this.timeLeft.next(25 * 60);
    this.timer$ = interval(1000).subscribe(() => {
      if (this.timeLeft.value > 0) {
        this.timeLeft.next(this.timeLeft.value - 1);
      } else {
        this.handleBreak();
      }
    });
  }

  longSesion() {
    this.stopTimer();
    this.timeLeft.next(50 * 60);
    this.timer$ = interval(1000).subscribe(() => {
      if (this.timeLeft.value > 0) {
        this.timeLeft.next(this.timeLeft.value - 1);
      } else {
        this.handleBreak();
      }
    });
  }

  handleBreak() {
    this.stopTimer();
    this.sessionCount++;

    if (this.sessionDuration === 25 * 60) {
      if (this.sessionCount % 4 === 0) {
        this.timeLeft.next(15 * 60);
      } else {
        this.timeLeft.next(5 * 60);
      }
    } else if (this.sessionDuration === 50 * 60) {
      if (this.sessionCount % 4 === 0) {
        this.timeLeft.next(25 * 60);
      } else {
        this.timeLeft.next(15 * 60);
      }
    }

    this.timer$ = interval(1000).subscribe(() => {
      if (this.timeLeft.value > 0) {
        this.timeLeft.next(this.timeLeft.value - 1);
      } else {
        this.startSession(this.sessionDuration);
      }
    });
  }

  stopTimer() {
    if (this.timer$) {
      this.timer$.unsubscribe();
      this.timer$ = null;
      this.isTimerRunning = false;
      this.isPaused = true;
    }
  }

  resumeTimer() {
    if (this.isPaused) {
      this.isTimerRunning = true;
      this.isPaused = false;

      this.timer$ = interval(1000).subscribe(() => {
        if (this.timeLeft.value > 0) {
          this.timeLeft.next(this.timeLeft.value - 1);
        } else {
          this.handleBreak();
        }
      });
    }
  }

  resetTimer() {
    this.stopTimer();
    this.sessionCount = 0;
    this.timeLeft.next(this.sessionDuration);
    this.isTimerRunning = false;
    this.isPaused = false;
  }
}
