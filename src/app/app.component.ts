import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavComponent, FooterComponent, NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'tricia';
  whatsappUrl = 'https://wa.me/';
  phoneNumber = '';

  constructor(
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _DataService: DataService
  ) {
    // Set default language
    translate.setDefaultLang('en');

    if (isPlatformBrowser(this.platformId)) {
      const langCode = localStorage.getItem('language') || 'en';
      translate.use(langCode);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const langCode = localStorage.getItem('language') || 'en';

      // Apply lang and dir to <html>
      const htmlTag = document.documentElement;
      htmlTag.setAttribute('lang', langCode);
      htmlTag.setAttribute('dir', 'ltr'); // Both English and Spanish are LTR

      // Listen for language changes
      this.translate.onLangChange.subscribe((event) => {
        const currentLang = event.lang;
        htmlTag.setAttribute('lang', currentLang);
        htmlTag.setAttribute('dir', 'ltr'); // Both English and Spanish are LTR
      });
    }

    this.getWhatsAppNumber();
  }

  getWhatsAppNumber(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        const contactPhone = res.data.find(
          (item: any) => item.option_key === 'CONTACT_PHONE_NUMBER'
        );
        this.phoneNumber = contactPhone?.option_value[0] || '';

        if (this.phoneNumber) {
          // Remove all non-digit characters
          let cleanNumber = this.phoneNumber.replace(/\D/g, '');

          // If number doesn't start with country code, you might need to add it
          // For example, if it's an Egyptian number starting with 0, remove the 0 and add 20
          // Adjust this logic based on your phone number format

          if (cleanNumber) {
            this.whatsappUrl = `https://wa.me/${cleanNumber}`;
          }
        }
      },
      error: (err) => {
        console.log('Error loading WhatsApp number:', err);
      },
    });
  }
}
