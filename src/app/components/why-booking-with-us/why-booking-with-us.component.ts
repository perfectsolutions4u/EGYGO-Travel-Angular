import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
  Inject,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-why-booking-with-us',
  standalone: true,
  imports: [TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './why-booking-with-us.component.html',
  styleUrl: './why-booking-with-us.component.scss',
})
export class WhyBookingWithUsComponent implements AfterViewInit {
  @ViewChild('bookingCarousel') bookingCarousel!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeSwiper();
      }, 100);
    }
  }

  initializeSwiper() {
    if (this.bookingCarousel?.nativeElement) {
      const el = this.bookingCarousel.nativeElement;
      el.slidesPerView = 1.5;
      el.spaceBetween = 20;
      el.loop = true;
      el.autoplay = { delay: 2500, disableOnInteraction: false };
      el.speed = 1500;
      el.breakpoints = {
        0: { slidesPerView: 1.5 },
        586: { slidesPerView: 2 },
        768: { slidesPerView: 2.5 },
        992: { slidesPerView: 3 },
        1200: { slidesPerView: 4 },
        // 1400: { slidesPerView: 6 },
      };
      el.initialize();
    }
  }
  bookingItems = [
    {
      icon: 'fa-regular fa-gem',
      title: 'whyBooking.qualityTrustedPartner',
      titleIsTranslation: true,
      description: 'whyBooking.qualityTrustedPartnerDesc',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa fa-shield-halved',
      title: 'whyBooking.bookWithConfidence',
      titleIsTranslation: true,
      description: 'whyBooking.bookWithConfidenceDesc',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-regular fa-star',
      title: 'whyBooking.personalisedTravelServices',
      titleIsTranslation: true,
      description: 'whyBooking.personalisedTravelServicesDesc',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa fa-user-shield',
      title: 'whyBooking.safetySecurity',
      titleIsTranslation: true,
      description: 'whyBooking.safetySecurityDesc',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa fa-building-shield',
      title: 'whyBooking.securePayments',
      titleIsTranslation: true,
      description: 'whyBooking.securePaymentsDesc',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa fa-leaf',
      title: 'whyBooking.sustainableEthicalApproach',
      titleIsTranslation: true,
      description: 'whyBooking.sustainableEthicalApproachDesc',
      descriptionIsTranslation: true,
    },
  ];
}
