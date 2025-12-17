import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { DataService } from '../../core/services/data.service';
import { SeoService } from '../../core/services/seo.service';
import { BlogCartComponent } from '../../components/blog-cart/blog-cart.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    BannerComponent,
    BlogCartComponent,
    CommonModule,
    PaginationComponent,
    NgxPaginationModule,
    MakeTripFormComponent,
    TranslateModule,
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  bannerTitle: string = 'blog';
  bannerImage = '../../../assets/image/new/1.webp';

  allBlogs: any[] = [];

  // pagination
  itemsPerPage: number = 6;
  currentPage: number = 1;
  totalItems: number = 0;

  constructor(
    private _DataService: DataService,
    private _SeoService: SeoService
  ) {}

  ngOnInit(): void {
    this._SeoService.updateSeoData(
      {},
      'EgyGo - Blog',
      'Read our travel blog for tips, guides, and stories about amazing destinations. Get inspired for your next adventure with EGYGO Travel.',
      '/assets/image/logo-egygo.webp'
    );
    this._DataService.getBlogs().subscribe({
      next: (res) => {
        this.allBlogs = res?.data?.data ?? res ?? [];
        this.totalItems = this.allBlogs.length; // client-side pagination
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
