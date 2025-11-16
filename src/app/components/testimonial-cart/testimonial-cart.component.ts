import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonial-cart',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './testimonial-cart.component.html',
  styleUrl: './testimonial-cart.component.scss',
})
export class TestimonialCartComponent {
  constructor(private _DataService: DataService) {}

  allReviews: any[] = [];

  ngOnInit(): void {
    this.getTestimonials();
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

  testimonialOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: false,
    smartSpeed: 1500,
    margin: 30,
    items: 1,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    nav: true,
    navText: [
      '<i class="fa fa-angle-double-left"></i>',
      '<i class="fa fa-angle-double-right"></i>',
    ],
  };

  getStars(rate: number): boolean[] {
    const safeRate = Math.max(0, Math.min(5, Math.floor(rate || 0)));
    return Array.from({ length: 5 }, (_, i) => i < safeRate);
  }
}
