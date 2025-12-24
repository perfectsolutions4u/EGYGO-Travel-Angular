import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BaseService } from './base.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class BookingService extends BaseService {
  private readonly CACHE_KEY_COUNTRIES = 'app_countries_cache';

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
  // tour details
  appendBookingData(bookingForm: object): Observable<any> {
    return this.HttpClient.post(
      `${this.baseUrl}/cart/tours/append`,
      bookingForm
    );
  }

  // cart
  getCartList(): Observable<any> {
    return this.HttpClient.get(`${this.baseUrl}/cart/list`);
  }

  deleteTourCart(tourCart: any): Observable<any> {
    return this.HttpClient.delete(`${this.baseUrl}/cart/remove/${tourCart}`);
  }

  clearTourCart(): Observable<any> {
    return this.HttpClient.delete(`${this.baseUrl}/cart/clear`);
  }

  //checkout coupon
  getCoupon(code: any): Observable<any> {
    return this.HttpClient.get(`${this.baseUrl}/coupons/${code}/validate`);
  }

  sendCheckoutData(checkoutData: object): Observable<any> {
    return this.HttpClient.post(`${this.baseUrl}/bookings`, checkoutData);
  }

  getCountries(): Observable<any> {
    const cached = this.getFromCache<any>(this.CACHE_KEY_COUNTRIES);
    if (cached) {
      return of(cached);
    }

    return this.HttpClient.get(`${this.baseUrl}/countries`).pipe(
      tap((response: any) => {
        if (response && response.data) {
          this.setCache(this.CACHE_KEY_COUNTRIES, response);
        }
      })
    );
  }
}
