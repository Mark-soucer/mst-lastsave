'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCookieConsent } from '@/context/CookieConsentContext';

export default function CookieBanner() {
  const { consent, ready, showSettings, save, acceptAll, rejectAll, closeSettings } = useCookieConsent();
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (showSettings) setExpanded(true);
  }, [showSettings]);

  useEffect(() => {
    if (expanded) {
      setAnalytics(consent?.analytics ?? false);
      setMarketing(consent?.marketing ?? false);
    }
  }, [expanded, consent]);

  if (!ready) return null;
  if (consent !== null && !showSettings) return null;

  const btn = 'rounded-full px-5 py-2.5 text-sm font-bold transition';
  const ghost = `${btn} border border-white/15 text-white md:hover:border-white/40`;
  const primary = `${btn} bg-[#D50000] text-white md:hover:bg-[#FF1A1A]`;

  const close = () => {
    setExpanded(false);
    closeSettings();
  };

  return (
    <div
      role="dialog"
      aria-label="Setări cookie-uri"
      className="fixed inset-x-4 bottom-4 z-[75] mx-auto max-w-lg rounded-2xl border border-white/15 bg-[#111111] p-5 text-white shadow-2xl md:inset-x-auto md:bottom-6 md:right-6"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold">Cookie-uri</h2>
        {consent !== null && (
          <button type="button" onClick={close} aria-label="Închide" className="text-neutral-400 md:hover:text-white">
            ✕
          </button>
        )}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-neutral-300">
        Folosim cookie-uri necesare pentru funcționarea site-ului. Cu acordul tău, folosim și cookie-uri de marketing,
        pentru a măsura campaniile Google Ads. Detalii în{' '}
        <Link href="/politica-cookie" className="text-[#FF1A1A] underline underline-offset-2">
          Politica cookie-urilor
        </Link>
        .
      </p>

      {expanded && (
        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
            <span>
              <span className="font-semibold">Necesare</span>
              <span className="block text-xs text-neutral-400">Autentificare și preferințele tale. Mereu active.</span>
            </span>
            <input type="checkbox" checked disabled className="h-4 w-4 accent-[#D50000]" />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
            <span>
              <span className="font-semibold">Analitice</span>
              <span className="block text-xs text-neutral-400">Statistici anonime despre vizite.</span>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="h-4 w-4 accent-[#D50000]"
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
            <span>
              <span className="font-semibold">Marketing</span>
              <span className="block text-xs text-neutral-400">Google Ads, pentru a măsura campaniile.</span>
            </span>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="h-4 w-4 accent-[#D50000]"
            />
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {expanded ? (
          <>
            <button type="button" onClick={() => save({ analytics, marketing })} className={ghost}>
              Salvează alegerile
            </button>
            <button type="button" onClick={acceptAll} className={primary}>
              Acceptă toate
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={rejectAll} className={ghost}>
              Refuză toate
            </button>
            <button type="button" onClick={() => setExpanded(true)} className={ghost}>
              Setări
            </button>
            <button type="button" onClick={acceptAll} className={primary}>
              Acceptă toate
            </button>
          </>
        )}
      </div>
    </div>
  );
}
