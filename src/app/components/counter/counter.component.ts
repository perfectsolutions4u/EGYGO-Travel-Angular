import { Component } from '@angular/core';
import { NgxCountAnimationDirective } from 'ngx-count-animation';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [NgxCountAnimationDirective, TranslateModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
})
export class CounterComponent {}
