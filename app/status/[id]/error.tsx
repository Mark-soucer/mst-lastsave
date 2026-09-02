'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

type StatusErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function StatusError({ error, reset }: StatusErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080808] pt-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,0,0,0.12),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl">
          Nu am putut încărca statusul comenzii
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
          A apărut o eroare temporară de comunicare cu serverul. Încearcă din nou sau
          contactează-ne direct.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(213,0,0,0.45)] transition-all hover:bg-[#FF1A1A]"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Încearcă din nou
        </button>
      </div>
    </div>
  );
}
