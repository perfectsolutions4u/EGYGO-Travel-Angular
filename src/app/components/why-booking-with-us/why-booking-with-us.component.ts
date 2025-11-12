import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-why-booking-with-us',
  standalone: true,
  imports: [TranslateModule, CarouselModule],
  templateUrl: './why-booking-with-us.component.html',
  styleUrl: './why-booking-with-us.component.scss',
})
export class WhyBookingWithUsComponent {
  bookingItems = [
    {
      icon: 'fa-comment-dollar',
      title: 'whyBooking.easyWaysToPay',
      titleIsTranslation: true,
      description: 'whyBooking.description',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-hexagon-nodes',
      title: 'whyBooking.freedomToChange',
      titleIsTranslation: true,
      description: 'whyBooking.description',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-ship',
      title: 'whyBooking.refundGuarantee',
      titleIsTranslation: true,
      description: 'whyBooking.description',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-suitcase',
      title: 'whyBooking.bestPriceGuarantee',
      titleIsTranslation: true,
      description: 'whyBooking.description',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-anchor',
      title: 'ATOL Protected',
      titleIsTranslation: false,
      description:
        'It is a long established fact that a reader will be distracted',
      descriptionIsTranslation: false,
    },
    {
      icon: 'fa-passport',
      title: 'Maldivian Islands Trip',
      titleIsTranslation: false,
      description:
        'It is a long established fact that a reader will be distracted',
      descriptionIsTranslation: false,
    },
  ];

  bookingOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: false,
    nav: false,
    smartSpeed: 2500,
    margin: 20,
    responsive: {
      0: { items: 1.5 },
      400: { items: 2.5 },
      576: { items: 3.5 },
      768: { items: 4.5 },
      // 992: { items: 4.5 },
      1200: { items: 6 },
    },
  };
}
