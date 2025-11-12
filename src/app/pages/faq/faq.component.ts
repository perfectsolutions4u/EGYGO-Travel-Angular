import { Component } from '@angular/core';
import { FaqContentComponent } from '../../components/faq-content/faq-content.component';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    FaqContentComponent,
    CommonModule,
    BannerComponent,
    MakeTripFormComponent,
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  bannerTitle: string = 'FAQ';
}
