import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestinationCartComponent } from '../../components/destination-cart/destination-cart.component';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from '../../core/services/data.service';
import { PartnerSliderComponent } from '../../components/partner-slider/partner-slider.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [
    DestinationCartComponent,
    CommonModule,
    CarouselModule,
    PartnerSliderComponent,
    BannerComponent,
    MakeTripFormComponent,
  ],
  templateUrl: './destination.component.html',
  styleUrl: './destination.component.scss',
})
export class DestinationComponent implements OnInit {
  constructor(private _DataService: DataService) {}
  allDestinations: any[] = [];

  bannerTitle: string = 'destination';

  ngOnInit(): void {
    this.getDestination();
  }

  getDestination() {
    this._DataService.getDestination().subscribe({
      next: (res) => {
        this.allDestinations = res.data.data;

        console.log('all destinations', res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  destinationOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    smartSpeed: 1500,
    margin: 10,
    responsive: {
      0: { items: 1.5 },
      767: { items: 2.5 },
      992: { items: 3.5 },
      1200: { items: 4.5 },
    },
    nav: true,
    navText: [
      '<i class="fa fa-angle-double-left"></i>',
      '<i class="fa fa-angle-double-right"></i>',
    ],
  };
}
