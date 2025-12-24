import { HttpParams, HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseService } from './base.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DataService extends BaseService {
  private readonly CACHE_KEYS = {
    SETTINGS: 'app_settings_cache',
    COUNTRIES: 'app_countries_cache',
    CATEGORIES: 'app_categories_cache',
    DESTINATIONS: 'app_destinations_cache',
    DURATIONS: 'app_durations_cache',
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    protected override HttpClient: HttpClient
  ) {
    super(HttpClient);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error(`Error reading cache for ${key}:`, error);
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error setting cache for ${key}:`, error);
    }
  }

  private clearCache(key: string): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing cache for ${key}:`, error);
    }
  }
  getTours(searchObj?: any, page: number = 1): Observable<any> {
    const params = {
      includes: 'destinations,categories,days,seo',
      ...searchObj,
      page: page,
    };
    return this.HttpClient.get(`${this.baseUrl}/tours`, { params: params });
  }

  getTourPagination(page: number): Observable<any> {
    return this.HttpClient.get(
      `${this.baseUrl}/tours?includes=destinations,categories,days,seo&page=${page}`
    );
  }

  getToursSlug(slug: any): Observable<any> {
    return this.HttpClient.get(
      `${this.baseUrl}/tours/${slug}?includes=destinations,categories,days,seo`
    );
  }

  getDestination(parent_id: any = 1): Observable<any> {
    // Cache key includes parent_id to cache different destination trees
    const cacheKey = `${this.CACHE_KEYS.DESTINATIONS}_${parent_id || 1}`;
    const cached = this.getFromCache<any>(cacheKey);
    if (cached) {
      return of(cached);
    }

    let paramsId = new HttpParams();
    if (parent_id) {
      paramsId = paramsId.set('parent_id', parent_id);
    }

    return this.HttpClient.get(`${this.baseUrl}/destinations?includes=seo`, {
      params: paramsId,
    }).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.setCache(cacheKey, response);
        }
      })
    );
  }

  getDestinationBySlug(slug: string): Observable<any> {
    return this.HttpClient.get(
      `${this.baseUrl}/destinations/${slug}?includes=seo`
    );
  }

  getCategories(): Observable<any> {
    const cached = this.getFromCache<any>(this.CACHE_KEYS.CATEGORIES);
    if (cached) {
      return of(cached);
    }

    return this.HttpClient.get(`${this.baseUrl}/categories?includes=seo`, {
      params: { page_limit: 100 },
    }).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.setCache(this.CACHE_KEYS.CATEGORIES, response);
        }
      })
    );
  }

  getCategoriesBlog(id?: number): Observable<any> {
    const url = id
      ? `${this.baseUrl}/blog-categories/${id}`
      : `${this.baseUrl}/blog-categories`;
    return this.HttpClient.get(url);
  }

  postReviews(userReview: object, id: number): Observable<any> {
    return this.HttpClient.post(
      `${this.baseUrl}/tour-reviews/${id}`,
      userReview
    );
  }

  getToursDuration(): Observable<any> {
    const cached = this.getFromCache<any>(this.CACHE_KEYS.DURATIONS);
    if (cached) {
      return of(cached);
    }

    return this.HttpClient.get(`${this.baseUrl}/durations`).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.setCache(this.CACHE_KEYS.DURATIONS, response);
        }
      })
    );
  }

  getReviews(tourId?: number): Observable<any> {
    const params = tourId ? { tour_id: tourId.toString() } : undefined;
    return this.HttpClient.get(`${this.baseUrl}/tour-reviews`, { params });
  }

  // wishlist
  toggleWishlist(id: number): Observable<any> {
    return this.HttpClient.put(`${this.baseUrl}/wishlist/${id}/toggle`, {});
  }

  getWishlist(): Observable<any> {
    return this.HttpClient.get(`${this.baseUrl}/wishlist`);
  }

  // blogs
  getBlogs(slug?: string): Observable<any> {
    const url = slug
      ? `${this.baseUrl}/blogs/${slug}`
      : `${this.baseUrl}/blogs`;
    return this.HttpClient.get(url);
  }

  // contact
  contactData(contactForm: any): Observable<any> {
    return this.HttpClient.post(
      `${this.baseUrl}/contact-requests`,
      contactForm
    );
  }

  // countries
  getCountries(): Observable<any> {
    const cached = this.getFromCache<any>(this.CACHE_KEYS.COUNTRIES);
    if (cached) {
      return of(cached);
    }

    return this.HttpClient.get(`${this.baseUrl}/countries`).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.setCache(this.CACHE_KEYS.COUNTRIES, response);
        }
      })
    );
  }

  // faqs
  getFAQs(): Observable<any> {
    return this.HttpClient.get(`${this.baseUrl}/faqs`);
  }

  // settings
  getSetting(): Observable<any> {
    const cached = this.getFromCache<any>(this.CACHE_KEYS.SETTINGS);
    if (cached) {
      return of(cached);
    }

    return this.HttpClient.get(`${this.baseUrl}/settings`).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.setCache(this.CACHE_KEYS.SETTINGS, response);
        }
      })
    );
  }

  // Method to clear specific cache (useful for admin updates)
  clearSettingsCache(): void {
    this.clearCache(this.CACHE_KEYS.SETTINGS);
  }

  clearCountriesCache(): void {
    this.clearCache(this.CACHE_KEYS.COUNTRIES);
  }

  clearAllCache(): void {
    Object.values(this.CACHE_KEYS).forEach((key) => {
      this.clearCache(key);
    });
    // Also clear destination caches with different parent_ids
    if (this.isBrowser()) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(this.CACHE_KEYS.DESTINATIONS)) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  // gallery
  getGallery(): Observable<any> {
    return this.HttpClient.get(`${this.baseUrl}/pages/gallery`);
  }
}
