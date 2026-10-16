'use client';

import { useEffect, useRef } from 'react';
import { useCookieConsent } from '@/context/CookieConsentContext';

// ID-ul contului Google Ads, de forma AW-XXXXXXXXX. Se setează în Vercel ca NEXT_PUBLIC_GOOGLE_ADS_ID.
// Cât timp lipsește, nimic nu se încarcă de la Google.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAdsTag() {
  const { consent, ready } = useCookieConsent();
  const scriptLoaded = useRef(false);
  const defaultsSet = useRef(false);

  // Pasul 1: înainte de orice, Google primește „refuzat” ca valoare implicită (Consent Mode v2).
  useEffect(() => {
    if (!ADS_ID || defaultsSet.current) return;
    defaultsSet.current = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      // eslint-disable-next-line prefer-rest-params
      function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  }, []);

  // Pasul 2: după alegerea vizitatorului, actualizăm consimțământul și încărcăm eticheta doar dacă a acceptat marketing.
  useEffect(() => {
    if (!ADS_ID || !ready || !consent || !window.gtag) return;

    window.gtag('consent', 'update', {
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
    });

    if (consent.marketing && !scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`;
      document.head.appendChild(script);
      window.gtag('js', new Date());
      window.gtag('config', ADS_ID);
    }
  }, [consent, ready]);

  return null;
}
