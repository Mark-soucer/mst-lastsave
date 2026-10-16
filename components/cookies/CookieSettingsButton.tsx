'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';

export default function CookieSettingsButton() {
  const { openSettings } = useCookieConsent();
  return (
    <button
      type="button"
      onClick={openSettings}
      className="inline-flex rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white transition md:hover:bg-[#FF1A1A]"
    >
      Modifică setările cookie-urilor
    </button>
  );
}
