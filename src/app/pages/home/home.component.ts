import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from '../../core/services/data.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TourCartComponent } from '../../components/tour-cart/tour-cart.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DestinationCartComponent } from '../../components/destination-cart/destination-cart.component';
import { TeamCartComponent } from '../../components/team-cart/team-cart.component';
import { BlogCartComponent } from '../../components/blog-cart/blog-cart.component';
import { BooknowComponent } from '../../components/booknow/booknow.component';
import { TestimonialCartComponent } from '../../components/testimonial-cart/testimonial-cart.component';
import { PartnerSliderComponent } from '../../components/partner-slider/partner-slider.component';
import { AboutsectionComponent } from '../../components/aboutsection/aboutsection.component';
import { Subject, takeUntil, tap } from 'rxjs';
import { WhyBookingWithUsComponent } from '../../components/why-booking-with-us/why-booking-with-us.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MaketripService } from '../../core/services/maketrip.service';
import { CounterComponent } from '../../components/counter/counter.component';
import { TranslateModule } from '@ngx-translate/core';
import { AboutCategoryComponent } from '../../components/about-category/about-category.component';

interface DestinationPriceMap {
  [title: string]: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CarouselModule,
    CommonModule,
    ReactiveFormsModule,
    // RouterLink,
    TourCartComponent,
    // DestinationCartComponent,
    // TeamCartComponent,
    BlogCartComponent,
    // BooknowComponent,
    TestimonialCartComponent,
    PartnerSliderComponent,
    AboutsectionComponent,
    WhyBookingWithUsComponent,
    MatTabsModule,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    // CounterComponent,
    TranslateModule,
    DestinationCartComponent,
    AboutCategoryComponent,
    CounterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private $destory = new Subject<void>();
  constructor(
    private _DataService: DataService,
    private _Router: Router,
    private _MaketripService: MaketripService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.rawVideoUrl
    );
    this.isBrowser = isPlatformBrowser(platformId);
  }

  tourSearchForm!: FormGroup;
  allDestinations: any[] = [];
  allCategories: any[] = [];
  allDurations: any[] = [];
  alltours: any[] = [];
  alltoursInDestination: any[] = [];
  categoriesWithTours: any[] = []; // Store categories with included tours
  allToursFromCategories: any[] = []; // Bound to UI: current (possibly filtered) list
  allToursMaster: any[] = []; // Immutable master list to filter from
  destinationPrices: DestinationPriceMap = {};
  categoryPrices: DestinationPriceMap = {};
  activeCategoryTitle: string | null = null;
  activeDestinationTitle: string | null = null;
  allBlogs: any[] = [];
  allReviews: any[] = [];

  mainSecSlider: any[] = [
    { src: '../../../assets/image/new/9.png' },
    { src: '../../../assets/image/new/13.png' },
    { src: '../../../assets/image/new/7.png' },
    { src: '../../../assets/image/new/4.png' },
    // { src: '../../../assets/image/new/14.png' },
    // { src: '../../../assets/image/new/10.png' },
    // { src: '../../../assets/image/new/4.png' },
    // { src: '../../../assets/image/new/5.png' },
  ];

  // video
  rawVideoUrl = 'https://www.youtube.com/embed/k3KqP69xuPc?si=jlt_SSYpm0STHo7I';
  posterSrc = '../../../assets/images/blog2.jpg';
  sanitizedVideoUrl: SafeResourceUrl | null = null;
  isVideoPlaying = false;
  isBrowser = false;

  MarkTime: string = 'exact';
  monthList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  ngOnInit(): void {
    this.getDestination();
    this.getCategory();
    this.getDurations();
    // Initial filtering will run after categories load to ensure data is present
    // this.getDestinationTours();
    this.getTestimonials();
    this.tourSearchForm = new FormGroup({
      location: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      duration: new FormControl(''),
    });
  }

  makeTripForm = new FormGroup({
    city: new FormControl('', Validators.required),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    approximate_time: new FormControl(''),
  });

  onTourSubmit() {
    const formData = {
      ...this.tourSearchForm.value,
    };

    // navigate to tour List
    this._Router.navigate(['/tour'], {
      queryParams: formData,
    });
  }

  onMakeTripSubmit() {
    if (this.makeTripForm.invalid) return;

    // console.log('fire done onMakeTripSubmit');
    // console.log(this.makeTripForm.value);

    const formValue = this.makeTripForm.value;

    this._MaketripService.setMakeTripSteps({
      destination: formValue.city || undefined,
      fromDuration: formValue.start_date || null,
      ToDuration: formValue.end_date || null,
      appro: formValue.approximate_time || null,
    });

    this._Router.navigate(['/makeTrip']);
  }

  onChangeTime(TypeTime: string): void {
    this.MarkTime = TypeTime;
  }

  getTours(categoryTitle?: string) {
    this.activeCategoryTitle = categoryTitle ?? null;

    // Always filter from master list
    let filtered = [...this.allToursMaster];

    if (categoryTitle) {
      const normalize = (s?: string) => (s ?? '').trim().toLowerCase();
      const normalizedCategoryTitle = normalize(categoryTitle);

      filtered = filtered.filter((tour: any) => {
        // Check if tour has category_ids array (added during extraction)
        if (tour.category_ids && Array.isArray(tour.category_ids)) {
          return tour.category_ids.some((catId: number) => {
            const category = this.allCategories.find((cat) => cat.id === catId);
            return (
              category && normalize(category.title) === normalizedCategoryTitle
            );
          });
        }
        // Check if tour has categories array (from regular API calls)
        if (tour.categories && Array.isArray(tour.categories)) {
          return tour.categories.some(
            (c: any) => normalize(c.title) === normalizedCategoryTitle
          );
        }
        // Check if tour has pivot with category_id (from included tours data)
        if (tour.pivot && tour.pivot.category_id) {
          const category = this.allCategories.find(
            (cat) => cat.id === tour.pivot.category_id
          );
          return (
            category && normalize(category.title) === normalizedCategoryTitle
          );
        }
        // Check if tour has single category_id (legacy support)
        if (tour.category_id) {
          const category = this.allCategories.find(
            (cat) => cat.id === tour.category_id
          );
          return (
            category && normalize(category.title) === normalizedCategoryTitle
          );
        }
        return false;
      });
    }

    // Write filtered list back to the UI-bound array used by the template
    this.allToursFromCategories = filtered;
    this.alltours = filtered;

    // get lowest price for destinations and categories
    this.destinationPrices = {};
    this.categoryPrices = {};

    for (const tour of filtered) {
      const price = Number(tour.start_from) || 0;

      (tour.destinations || []).forEach((dest: any) => {
        if (
          this.destinationPrices[dest.title] == null ||
          price < this.destinationPrices[dest.title]
        ) {
          this.destinationPrices[dest.title] = price;
        }
      });

      (tour.categories || []).forEach((cat: any) => {
        if (
          this.categoryPrices[cat.title] == null ||
          price < this.categoryPrices[cat.title]
        ) {
          this.categoryPrices[cat.title] = price;
        }
      });
    }

    // console.log('Filtered tours by category:', this.allToursFromCategories);
    // console.log(
    //   'Total tours before filtering:',
    //   this.allToursFromCategories.length
    // );
    // console.log('Total tours after filtering:', filtered.length);
  }

  getDestinationTours(destinationTitle?: string): void {
    this.activeDestinationTitle = destinationTitle ?? null;

    // Always filter from master list
    let filtered = [...this.allToursMaster];

    if (destinationTitle) {
      const normalize = (s?: string) => (s ?? '').trim().toLowerCase();
      const normalizedDestinationTitle = normalize(destinationTitle);

      filtered = filtered.filter((tour: any) => {
        return (
          tour.destinations &&
          tour.destinations.some(
            (dest: any) => normalize(dest.title) === normalizedDestinationTitle
          )
        );
      });
    }

    this.alltoursInDestination = filtered;
    // console.log('Filtered tours by destination:', this.alltoursInDestination);
    // console.log('Selected destination:', destinationTitle);
    // console.log(
    //   'Total tours before filtering:',
    //   this.allToursFromCategories.length
    // );
    // console.log('Total tours after filtering:', filtered.length);
  }

  ngOnDestroy(): void {
    this.$destory.next();
    this.$destory.complete();
  }

  getDestination() {
    this._DataService
      .getDestination()
      .pipe(
        takeUntil(this.$destory), // close , clear suscripe memory on destroy
        tap((res) => {
          if (res) {
            // console.log('home page -- ', res);
            this.allDestinations = res.data.data;
          }
        })
      )
      .subscribe();
  }

  getCategory() {
    this._DataService.getCategories().subscribe({
      next: (res) => {
        console.log(res.data.data);

        this.allCategories = res.data.data;
        this.categoriesWithTours = res.data.data;

        // Extract all tours from categories and store them
        this.allToursFromCategories = [];
        const tourCategoryMap = new Map(); // Track which categories each tour belongs to

        this.categoriesWithTours.forEach((category) => {
          if (category.tours && Array.isArray(category.tours)) {
            category.tours.forEach((tour: any) => {
              // Check if tour already exists
              const existingTour = this.allToursFromCategories.find(
                (existingTour) => existingTour.id === tour.id
              );

              if (!existingTour) {
                // Add category information to tour for easier filtering
                tour.category_ids = [category.id];
                tour.category_titles = [category.title];
                this.allToursFromCategories.push(tour);
                tourCategoryMap.set(tour.id, [category.id]);
              } else {
                // Tour already exists, add this category to its list
                if (!existingTour.category_ids.includes(category.id)) {
                  existingTour.category_ids.push(category.id);
                  existingTour.category_titles.push(category.title);
                  tourCategoryMap.get(tour.id).push(category.id);
                }
              }
            });
          }
        });

        const pricesMap = this.categoryPrices; // مثل { Multi Days Tours: 80, Egypt Classic Tours: 100, Nile Cruises: 150 , Adventure Tours: 80,Culture Tours: 80 }
        console.log(pricesMap);

        this.allCategories = this.allCategories.map((cat: any) => {
          const categoryTitle = cat.title.trim().toLowerCase();
          let matched = false;

          for (const key in pricesMap) {
            const priceTitle = key.trim().toLowerCase();
            // console.log(priceTitle, categoryTitle);

            if (categoryTitle === priceTitle) {
              cat.start_price = pricesMap[key];
              matched = true;
              break;
            }
          }

          if (!matched) {
            cat.start_price = pricesMap['Nile Cruises']; // fallback to Nile Cruises price
            console.log('not matched');
          }

          return cat;
        });

        console.log('all categories with start price', this.allCategories);
        console.log('All tours from categories:', this.allToursFromCategories);
        console.log('Categories with tours:', this.categoriesWithTours);
        console.log('Tour category mapping:', tourCategoryMap);

        // Prepare master list and initialize default views
        if (this.allToursFromCategories.length > 0) {
          this.allToursMaster = [...this.allToursFromCategories];
          // Show all by default
          this.getTours();
          this.getDestinationTours();
        } else {
          // If no tours found in categories, get all tours as fallback
          console.log('No tours found in categories, fetching all tours...');
          this.getAllToursFallback();
        }
      },
    });
  }

  getAllToursFallback() {
    // Fallback method to get all tours if categories don't include them
    this._DataService.getTours().subscribe({
      next: (res) => {
        this.allToursFromCategories = res.data.data;
        this.allToursMaster = [...this.allToursFromCategories];
        this.alltours = [...this.allToursFromCategories];
        // Initialize default lists for both category and destination views
        this.getTours();
        this.getDestinationTours();
        console.log('Fallback: All tours loaded:', this.allToursFromCategories);
      },
      error: (err) => console.log(err),
    });
  }

  getDurations() {
    this._DataService
      .getToursDuration()
      .pipe(
        takeUntil(this.$destory), // close , clear suscripe memory on destroy
        tap((res) => {
          this.allDurations = res.data;
          console.log(this.allDurations);
        })
      )
      .subscribe({
        next: (res) => {
          // console.log(res.data);
        },
        error: (err) => {
          // console.log(err);
        },
      });
  }

  // testimonial
  getTestimonials() {
    this._DataService.getReviews().subscribe({
      next: (res) => {
        this.allReviews = res.data.data;
        console.log(this.allReviews);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onBlogsLoaded(blogs: any[]) {
    this.allBlogs = blogs;
  }

  // video controls
  openVideo() {
    this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.rawVideoUrl
    );
    this.isVideoPlaying = true;
  }
  closeVideo() {
    this.sanitizedVideoUrl = null;
    this.isVideoPlaying = false;
  }

  // rate star
  getStars(rate: number): boolean[] {
    const safeRate = Math.max(0, Math.min(5, Math.floor(rate || 0)));
    return Array.from({ length: 5 }, (_, i) => i < safeRate);
  }

  // owl carousel options

  destinationOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    smartSpeed: 2500,
    margin: 10,
    responsive: {
      0: { items: 1.5 },
      586: { items: 2.5 },
      767: { items: 3 },
      992: { items: 3.5 },
      // 1200: { items: 4 },
    },
    nav: false,
    // navText: [
    //   '<i class="fa fa-angle-double-left"></i>',
    //   '<i class="fa fa-angle-double-right"></i>',
    // ],
  };
  // testimonialOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: true,
  //   autoplay: true,
  //   dots: false,
  //   smartSpeed: 1500,
  //   margin: 30,
  //   responsive: {
  //     0: { items: 1 },
  //     992: { items: 2 },
  //   },
  //   nav: true,
  //   navText: [
  //     '<i class="fa fa-angle-double-left"></i>',
  //     '<i class="fa fa-angle-double-right"></i>',
  //   ],
  // };
  tourOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: false,
    smartSpeed: 2500,
    margin: 5,
    responsive: {
      0: { items: 1.5 },
      586: { items: 2.5 },
      767: { items: 3 },
      992: { items: 3.5 },
      1200: { items: 4 },
    },
    nav: true,
    navText: [
      '<i class="fa fa-arrow-left"></i>',
      '<i class="fa fa-arrow-right"></i>',
    ],
  };

  controlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: false,
    smartSpeed: 1500,
    margin: 10,
    responsive: {
      0: { items: 1.5 },
      400: { items: 2.5 },
      586: { items: 4 },
      767: { items: 5 },
      992: { items: 7 },
      // 1200: { items: 4 },
    },
    nav: false,
    navText: [
      '<i class="fa fa-angle-double-left"></i>',
      '<i class="fa fa-angle-double-right"></i>',
    ],
  };
}
