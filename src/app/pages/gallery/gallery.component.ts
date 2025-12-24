import {
  Component,
  OnInit,
  HostListener,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../core/services/seo.service';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, BannerComponent, MakeTripFormComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {
  bannerTitle = 'Gallery';
  bannerImage = '/assets/image/EgyGo-banner.webp';
  allImages: string[] = [];
  displayedImages: string[] = [];
  galleryImages: string[] = [];
  mobileGalleryImages: string[] = [];
  itemsPerPage = 9;
  currentPage = 0;
  isLoading = false;
  isLoadingMore = false;
  isMobile = false;

  // Intersection Observer
  private observer?: IntersectionObserver;

  // Lightbox properties
  isLightboxOpen = false;
  currentImageIndex = 0;
  zoomLevel = 1;
  isDragging = false;
  dragStartX = 0;
  dragStartY = 0;
  imagePositionX = 0;
  imagePositionY = 0;

  constructor(
    private seoService: SeoService,
    private _DataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.seoService.updateSeoData(
      {},
      'EgyGo - Gallery',
      'show all image about EgyGo travel in gallery',
      '/assets/image/logo-egygo.webp'
    );

    this.checkScreenSize();
    this.getGallery();
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
    this.updateImagesBasedOnScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  updateImagesBasedOnScreenSize(): void {
    // Only update if we have both gallery types
    if (this.galleryImages.length > 0 || this.mobileGalleryImages.length > 0) {
      if (this.isMobile && this.mobileGalleryImages.length > 0) {
        this.allImages = this.mobileGalleryImages;
      } else {
        this.allImages =
          this.galleryImages.length > 0
            ? this.galleryImages
            : this.mobileGalleryImages;
      }

      // Reset and reload images
      this.currentPage = 0;
      this.loadInitialImages();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  getGallery() {
    this.isLoading = true;
    this._DataService.getGallery().subscribe({
      next: (res) => {
        this.galleryImages = res.data.gallery || [];
        this.mobileGalleryImages = res.data.mobile_gallery || [];

        // Use mobile_gallery on mobile if available, otherwise use gallery
        if (this.isMobile && this.mobileGalleryImages.length > 0) {
          this.allImages = this.mobileGalleryImages;
        } else {
          this.allImages =
            this.galleryImages.length > 0
              ? this.galleryImages
              : this.mobileGalleryImages;
        }

        console.log(res.data);
        this.loadInitialImages();
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  loadInitialImages() {
    this.displayedImages = this.allImages.slice(0, this.itemsPerPage);
    this.currentPage = 1;
    // Setup observer after images are loaded
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 100);
  }

  preloadImages(imageUrls: string[]): Promise<void> {
    const imagePromises = imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to not block loading
        img.src = url;
      });
    });

    return Promise.all(imagePromises).then(() => {
      // Small delay to ensure images are rendered
      return new Promise((resolve) => setTimeout(resolve, 100));
    });
  }

  loadMoreImages() {
    if (
      this.isLoadingMore ||
      this.displayedImages.length >= this.allImages.length
    ) {
      return;
    }

    this.isLoadingMore = true;

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newImages = this.allImages.slice(startIndex, endIndex);

    // Preload images before adding them to displayedImages
    this.preloadImages(newImages).then(() => {
      this.displayedImages = [...this.displayedImages, ...newImages];
      this.currentPage++;
      this.isLoadingMore = false;

      // Re-setup observer after new images are loaded
      setTimeout(() => {
        this.setupIntersectionObserver();
      }, 100);
    });
  }

  setupIntersectionObserver(): void {
    // Disconnect existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Check if we have more images to load
    if (!this.hasMoreImages || this.isLightboxOpen) {
      return;
    }

    // Wait for view to update
    this.cdr.detectChanges();

    // Find the last image element
    const lastImageIndex = this.displayedImages.length - 1;
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length === 0) {
      return;
    }

    const lastItem = galleryItems[lastImageIndex] as HTMLElement;

    if (!lastItem) {
      return;
    }

    // Create intersection observer with 50px root margin
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            this.hasMoreImages &&
            !this.isLoadingMore
          ) {
            this.loadMoreImages();
          }
        });
      },
      {
        rootMargin: '25px', // Start loading 25px before the last image
        threshold: 0.1,
      }
    );

    // Observe the last image
    this.observer.observe(lastItem);
  }

  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.isLightboxOpen = true;
    this.zoomLevel = 1;
    this.imagePositionX = 0;
    this.imagePositionY = 0;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.zoomLevel = 1;
    this.imagePositionX = 0;
    this.imagePositionY = 0;
    document.body.style.overflow = '';
  }

  nextImage(): void {
    if (this.currentImageIndex < this.displayedImages.length - 1) {
      this.currentImageIndex++;
      this.zoomLevel = 1;
      this.imagePositionX = 0;
      this.imagePositionY = 0;
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.zoomLevel = 1;
      this.imagePositionX = 0;
      this.imagePositionY = 0;
    }
  }

  zoomIn(): void {
    this.zoomLevel = Math.min(this.zoomLevel + 0.25, 3);
  }

  zoomOut(): void {
    this.zoomLevel = Math.max(this.zoomLevel - 0.25, 0.5);
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.imagePositionX = 0;
    this.imagePositionY = 0;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;

    switch (event.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
        event.preventDefault();
        this.zoomOut();
        break;
    }
  }

  onImageMouseDown(event: MouseEvent): void {
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.dragStartX = event.clientX - this.imagePositionX;
      this.dragStartY = event.clientY - this.imagePositionY;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.zoomLevel > 1) {
      this.imagePositionX = event.clientX - this.dragStartX;
      this.imagePositionY = event.clientY - this.dragStartY;
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(): void {
    this.isDragging = false;
  }

  get currentImage(): string {
    return this.displayedImages[this.currentImageIndex] || '';
  }

  get hasMoreImages(): boolean {
    return this.displayedImages.length < this.allImages.length;
  }
}
