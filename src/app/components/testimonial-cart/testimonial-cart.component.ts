import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ViewChild,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-testimonial-cart',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonial-cart.component.html',
  styleUrl: './testimonial-cart.component.scss',
})
export class TestimonialCartComponent implements AfterViewInit {
  @ViewChild('testimonialCarousel')
  testimonialCarousel!: ElementRef;

  constructor(
    private _DataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  allReviews: any[] = [];

  ngOnInit(): void {
    // this.getTestimonials();
    this.allReviews = [
      {
        reviewer_name: 'Karim',
        reviewer_image:
          '../../../assets/image/new-reviewer/EgyGo-Travel-testimonial-Karim.png',
        reviewer_country: 'Cairo, Egypt',
        content:
          "Awesome trips, with very professional organizers who don't spare any effort to make your time the best ever. Highly recommended!",
        rate: 5,
      },
      {
        reviewer_name: 'Wafaa',
        reviewer_image:
          '../../../assets/image/new-reviewer/EgyGo-Travel-testimonial-Wafaa.png',
        reviewer_country: 'Cairo, Egypt',
        content:
          "I was amazed! I have visited many countries around the world, including the Caribbean, which fascinates everyone.  I haven't seen anything quite like Al Galala, where the mountains and the sea blend together in perfect harmony. I don't want to go back to Cairo! والله العظيم انا فى ذهول انا لفيت العالم وزرت الجزر إللى فى الكاريبى إللى يتبهر الدنيا كلها ماشفتش الجمال إللى شفته النهارده قطعه من جنه الله على الارض اوتيل فى حضن الجبل والبحرواقفه فى التراس مش عارفه انظر شمال ولا يمين ولا تحت ولا للاعلى الجمال بيحيط من كل جانب اقسم بالله مش عاوزه ارجع القاهره",
        rate: 5,
      },
      {
        reviewer_name: 'Suzanne',
        reviewer_image:
          '../../../assets/image/new-reviewer/EgyGo-Travel-testimonial-Suzanne-Cox.png',
        reviewer_country: 'Michigan, USA',
        content:
          'If you want a trip that is filled with fun then Egy Go is for you.  The entire trip to Luxor and Aswan was a wealth of information that cannot be found anywhere but here! The knowledge that the entire staff has cannot be compared to any other guided tour. The staff has an amazing ability of making you feel like they’ve known you for years, they welcome you like you’re family. Not to mention the nights on the cruise when we laughed until we cried. Can wait to book another trip with them. Thank you, thank you, thank you!!!!',
        rate: 5,
      },
      {
        reviewer_name: 'Scott',
        reviewer_image:
          '../../../assets/image/new-reviewer/EgyGo-Travel-testimonial-Scott-Noyes.png',
        reviewer_country: 'Denver, USA',
        content:
          'What a fantastic trip. Can’t wait to travel with the EgyGo team again on our next adventure! Everything was a VIP experience. From the initial meet and greet in Cairo, to Luxor and cruising the Nile. Then flights and transfers to South Sinai and Dahab, rounding it all off with outstanding scuba diving in the Red Sea. Our private guide was awesome, in fact he was so knowledgeable that other guides would ask him questions. The EgyGo team watched after us every step of the way. Thanks for a terrific trip! Looking forward to our next exploration.',
        rate: 4,
      },
      {
        reviewer_name: 'Iris Van Pelt',
        reviewer_image:
          '../../../assets/image/new-reviewer/James-Henderson_EgyGo-Travel-e1692213606701.jpg',
        reviewer_country: 'Iris Van Pelt',
        content:
          'Where shall I begin.., the incomparable service going beyond the extra mile, the desire and effort to make customers happy, the selection of the best places and times for visiting them without crowds, the perfect customization ? Or the incredible knowledge of the guiding Egyptologist and efficiency of the tour manager? It all contributed to an unforgettable experience that our group will never forget. Best trip ever and if 6stars existed, you would get it. Will be back ',
      },
      {
        reviewer_name: 'Sagy',
        reviewer_image:
          '../../../assets/image/new-reviewer/EgyGo-Travel-testimonial-Sagy.png',
        reviewer_country: 'Alexandria, Egypt',
        content:
          'Very enjoyable trips..Our trip with Egy go Travel to El Galala was amazing..I recommend it for everybody, very entertaining and interesting.Egy go Travel cares about their guests ',
        rate: 4,
      },
      {
        reviewer_name: 'Chris Sohar',
        reviewer_image:
          '../../../assets/image/new-reviewer/Chris-Sohar_EgyGo-Travel_testimonial.png',
        reviewer_country: 'Canada',
        content:
          'Egygo made our epic trip to Egypt so perfect!  They took care of everything for us so that we didn’t have to worry about the logistics and could focus on having a great time.  From meeting us at the airport upon arrival to escorting us back at the end and everything in between, all aspects of the trip were covered.  These services included the usual arrangements like hotels, local transportation and air travel but also money exchanges and dinner reservations as needed.  They even followed up with a hotel on our behalf after a minor misunderstanding.  The guides provided by Egygo were a delight with their thorough understanding of ancient (and current) Egypt and fluent English-speaking capabilities. It’s worth noting that the guides spoke highly of Egygo which is significant since they can work for anybody. We had a wonderful trip and Egygo made it happen!',
        rate: 5,
      },
    ];
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeSwiper();
      }, 100);
    }
  }

  initializeSwiper() {
    if (this.testimonialCarousel?.nativeElement && this.allReviews.length > 0) {
      const el = this.testimonialCarousel.nativeElement;
      el.slidesPerView = 1;
      el.spaceBetween = 10;
      el.loop = this.allReviews.length > 1;
      el.autoplay = { delay: 3500, disableOnInteraction: false };
      el.speed = 3500;
      // el.effect = 'fade';
      // el.fadeEffect = { crossFade: true };
      el.initialize();
    }
  }

  // Navigation methods
  prevTestimonial() {
    if (this.testimonialCarousel?.nativeElement) {
      this.testimonialCarousel.nativeElement.swiper.slidePrev();
    }
  }

  nextTestimonial() {
    if (this.testimonialCarousel?.nativeElement) {
      this.testimonialCarousel.nativeElement.swiper.slideNext();
    }
  }

  // testimonial
  getTestimonials() {
    this._DataService.getReviews().subscribe({
      next: (res) => {
        this.allReviews = res.data.data;
        // console.log(this.allReviews);
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.initializeSwiper();
          }, 100);
        }
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  expandedReviews: Set<number> = new Set();
  readonly MAX_REVIEW_LENGTH = 150;

  toggleReview(index: number) {
    if (this.expandedReviews.has(index)) {
      this.expandedReviews.delete(index);
    } else {
      this.expandedReviews.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedReviews.has(index);
  }

  shouldShowReadMore(content: string): boolean {
    return content.length > this.MAX_REVIEW_LENGTH;
  }

  getStars(rate: number): boolean[] {
    const safeRate = Math.max(0, Math.min(5, Math.floor(rate || 0)));
    return Array.from({ length: 5 }, (_, i) => i < safeRate);
  }
}
