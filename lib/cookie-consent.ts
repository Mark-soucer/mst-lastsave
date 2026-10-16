// Preferințele de cookie-uri ale vizitatorului. Se salvează în browser (localStorage).
export const COOKIE_CONSENT_KEY = 'mst_cookie_consent';

export type CookieChoices = { analytics: boolean; marketing: boolean };
export type CookieConsent = CookieChoices & { savedAt: string };

export function readConsent(): CookieConsent | null {
  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(choices: CookieChoices): CookieConsent {
  const value: CookieConsent = { ...choices, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(value));
  } catch {
    // browserul nu permite stocarea; alegerea rămâne valabilă doar în sesiunea curentă
  }
  return value;
}
