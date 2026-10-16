'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readConsent, writeConsent, type CookieChoices, type CookieConsent } from '@/lib/cookie-consent';

type CookieConsentValue = {
  consent: CookieConsent | null;
  ready: boolean;
  showSettings: boolean;
  save: (choices: CookieChoices) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const CookieConsentContext = createContext<CookieConsentValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setReady(true);
  }, []);

  const save = useCallback((choices: CookieChoices) => {
    setConsent(writeConsent(choices));
    setShowSettings(false);
  }, []);

  const acceptAll = useCallback(() => save({ analytics: true, marketing: true }), [save]);
  const rejectAll = useCallback(() => save({ analytics: false, marketing: false }), [save]);
  const openSettings = useCallback(() => setShowSettings(true), []);
  const closeSettings = useCallback(() => setShowSettings(false), []);

  const value = useMemo(
    () => ({ consent, ready, showSettings, save, acceptAll, rejectAll, openSettings, closeSettings }),
    [consent, ready, showSettings, save, acceptAll, rejectAll, openSettings, closeSettings]
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}

export function useCookieConsent(): CookieConsentValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error('useCookieConsent trebuie folosit în CookieConsentProvider.');
  return ctx;
}
