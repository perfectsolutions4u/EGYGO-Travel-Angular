import { Component, OnInit } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SocialComponent } from '../../components/social/social.component';
import { DataService } from '../../core/services/data.service';
import { SeoService } from '../../core/services/seo.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [
    BannerComponent,
    RouterLink,
    CommonModule,
    SocialComponent,
    RouterLink,
    ReactiveFormsModule,
    MakeTripFormComponent,
  ],
  templateUrl: './blog-details.component.html',
  styleUrl: './blog-details.component.scss',
})
export class BlogDetailsComponent implements OnInit {
  bannerTitle: string = '';
  bannerImage = '/assets/image/EgyGo-banner.webp';

  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private sanitizer: DomSanitizer,
    private _SeoService: SeoService
  ) {}

  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // slug or id
  blogParam: any = '';
  blogDetails: any = {};
  tags: any = [];
  blogs: any = [];
  blogListById: any = {};
  isListId: boolean = false;
  writeReview!: FormGroup;
  isLoading: boolean = false;
  blogCategories: any = [];

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        // console.log(param);
        this.blogParam = param.get('slug');
        // console.log('blog param:', this.blogParam);

        if (!isNaN(Number(this.blogParam))) {
          this._DataService.getCategoriesBlog(this.blogParam).subscribe({
            next: (response) => {
              // console.log(response.data);
              this.blogListById = response.data;
              this.bannerTitle = this.blogListById.title;
              // console.log(this.bannerTitle);
              this.isListId = true;
              response.data.created_at = this.formatDate(
                response.data.created_at
              );

              // Set banner image from banner or featured_image, otherwise use default
              if (response.data?.banner) {
                this.bannerImage = response.data.banner;
              } else if (response.data?.featured_image) {
                this.bannerImage = response.data.featured_image;
              } else {
                this.bannerImage = '/assets/image/EgyGo-banner.webp';
              }
            },
          });
        } else {
          this._DataService.getBlogs(this.blogParam).subscribe({
            next: (response) => {
              // console.log(response.data);
              this.blogDetails = response.data;
              this.bannerTitle = this.blogDetails.title;
              // console.log('blog details:', this.blogDetails);
              // Set banner image from banner or featured_image, otherwise use default
              if (this.blogDetails?.banner) {
                this.bannerImage = this.blogDetails.banner;
              } else if (this.blogDetails?.featured_image) {
                this.bannerImage = this.blogDetails.featured_image;
              } else {
                this.bannerImage = '/assets/image/EgyGo-banner.webp';
              }
              // console.log('banner image:', this.bannerImage);

              this.isListId = false;
              response.data.created_at = this.formatDate(
                response.data.created_at
              );
              this.tags = this.blogDetails.tags
                .split(',')
                .map((name: any) => name.trim());

              // if (response.data?.featured_image) {
              //   this.bannerImage = response.data.featured_image;
              // } else {
              //   this.bannerImage = '../../../assets/image/Egy Go banner.png';
              // }

              // this.writeReview.patchValue({ tour_id: response.data.id });

              // Update SEO
              this.updateBlogSEO(response.data);
            },
          });
        }
      },
    });
    this.showBlogs();
    this.showCategoriesBlog();
    this.writeReview = new FormGroup({
      reviewer_name: new FormControl(''),
      rate: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(5),
      ]),
      // confirm: new FormControl(''),
      content: new FormControl(''),
      tour_id: new FormControl(null),
    });
  }

  getWriteReview() {
    if (this.writeReview.valid) {
      // console.log(this.writeReview.value);
      this.isLoading = true;

      //untill api is not ready and mos3an confirm it
      // this._DataService.postReviews(this.writeReview.value ).subscribe({
      //   next: (response) => {
      //     console.log(response);
      //     if (response.status == true) {
      //       this.toaster.success(response.message);
      //       this.isLoading = false;
      //     }
      //   },
      // });
      this.writeReview.reset();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    });
  }

  showBlogs() {
    this._DataService.getBlogs().subscribe({
      next: (res) => {
        // console.log(res.data.data);
        this.blogs = res.data.data;
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  showCategoriesBlog() {
    this._DataService.getCategoriesBlog().subscribe({
      next: (res) => {
        // console.log(res.data.data);
        this.blogCategories = res.data.data;
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  updateBlogSEO(blog: any): void {
    // Extract SEO data from API if available
    const seoData: any = {};
    if (blog.seo) {
      if (blog.seo.meta_title) seoData.meta_title = blog.seo.meta_title;
      if (blog.seo.meta_description)
        seoData.meta_description = blog.seo.meta_description;
      if (blog.seo.meta_keywords)
        seoData.meta_keywords = blog.seo.meta_keywords;
      if (blog.seo.og_title) seoData.og_title = blog.seo.og_title;
      if (blog.seo.og_description)
        seoData.og_description = blog.seo.og_description;
      if (blog.seo.og_image) seoData.og_image = blog.seo.og_image;
      if (blog.seo.og_type) seoData.og_type = blog.seo.og_type;
      if (blog.seo.twitter_title)
        seoData.twitter_title = blog.seo.twitter_title;
      if (blog.seo.twitter_description)
        seoData.twitter_description = blog.seo.twitter_description;
      if (blog.seo.twitter_card) seoData.twitter_card = blog.seo.twitter_card;
      if (blog.seo.twitter_image)
        seoData.twitter_image = blog.seo.twitter_image;
      if (blog.seo.canonical) seoData.canonical = blog.seo.canonical;
      if (blog.seo.robots) seoData.robots = blog.seo.robots;
      if (blog.seo.structure_schema)
        seoData.structure_schema = blog.seo.structure_schema;
    }

    const blogImage =
      blog.seo?.og_image || blog.image || '/assets/image/logo-egygo.webp';
    const blogDescription =
      blog.seo?.meta_description ||
      blog.seo?.og_description ||
      blog.short_description ||
      blog.description ||
      `Read ${blog.title} on EGYGO Travel blog. Travel tips, guides, and insights.`;

    const fallbackTitle =
      blog.seo?.meta_title || blog.seo?.og_title || `EgyGo - ${blog.title}`;

    this._SeoService.updateSeoData(
      seoData,
      fallbackTitle,
      blogDescription.substring(0, 160),
      blogImage
    );
  }
}
