import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

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
  private audio: HTMLAudioElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.audio = new Audio('assets/alarm.mp3');
    }
  }

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

  showAlert() {
    this.stopTimer();
    if (this.audio) {
      this.audio.play();
    }

    Swal.fire({
      title: '¡Tiempo terminado!',
      text: 'Es hora de tomar un descanso.',
      icon: 'info',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
      didClose: () => {
        if (this.audio) {
          this.audio.pause();
          this.audio.currentTime = 0;
        }
      },
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

    if (this.audio) {
      this.audio
        .play()
        .catch((error) => console.error('Error al reproducir sonido:', error));
    }

    Swal.fire({
      title: '¡Tiempo terminado!',
      text: 'Es hora de tomar un descanso o continuar con la siguiente sesión.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Tomar descanso',
      cancelButtonText: 'Detener',
    }).then((result) => {
      if (result.isConfirmed) {
        this.startBreak();
      } else {
        this.stopTimer();
      }
    });
  }

  startBreak() {
    this.stopTimer();

    let breakDuration = this.sessionCount % 4 === 0 ? 15 * 60 : 5 * 60;
    this.timeLeft.next(breakDuration);
    this.isTimerRunning = true;

    this.timer$ = interval(1000).subscribe(() => {
      if (this.timeLeft.value > 0) {
        this.timeLeft.next(this.timeLeft.value - 1);
      } else {
        this.startSession(25 * 60);
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
