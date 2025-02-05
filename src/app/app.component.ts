import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { ImgComponent } from './img/img.component';
import { BtnStartStopComponent } from './btn-start-stop/btn-start-stop.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TimerComponent, ImgComponent, BtnStartStopComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'pomodoro';
}
