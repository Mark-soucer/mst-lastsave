'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, KeyRound, Search } from 'lucide-react';

export default function StatusLookup() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = code.trim();
    if (!trimmed) {
      setError('Introdu codul sau numărul comenzii.');
      return;
    }

    setError('');
    setLoading(true);

    // Normalizăm codul exact ca în repository (fără '#', fără spații, uppercase),
    // ca link-ul să fie mereu curat: "/status/L-WFT0".
    // Dacă am păstra '#' și am folosi encodeURIComponent, am ajunge la
    // "/status/%23L-WFT0", iar Next.js NU decodează '%23' înapoi în parametrul
    // rutei -> `getRepairOrder` ar primi "%23L-WFT0" și nu ar găsi comanda.
    const slug = trimmed.replace(/^#+/, '').toUpperCase();

    router.push(`/status/${encodeURIComponent(slug)}`);
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-[#080808] pt-28 pb-24 md:pt-36">
      <div
        className="pointer-events-none absolute -left-32 top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.12),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.09),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <Image
            src="/images/logo-mst-transparent.png"
            alt="MST SERVICE"
            width={200}
            height={70}
            priority
            className="h-12 w-auto object-contain drop-shadow-[0_10px_30px_rgba(255,26,26,0.35)] md:h-16"
          />

          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A0A0A0] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.9)]" />
            Status comandă
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
            Statusul mașinii tale
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#A0A0A0] md:text-base">
            Introdu codul unic sau numărul comenzii primit de la service pentru a vedea
            progresul lucrărilor.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8"
        >
          <label
            htmlFor="status-code"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A0A0A0]"
          >
            <KeyRound className="h-4 w-4 text-[#FF1A1A]" aria-hidden="true" />
            Cod sau număr comandă
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]"
                aria-hidden="true"
              />
              <input
                id="status-code"
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                placeholder="Ex: 1048 sau ABC123"
                autoComplete="off"
                className="w-full rounded-full border border-white/10 bg-[#0B0B0B] py-3.5 pl-11 pr-4 text-sm font-semibold text-white placeholder-[#555] outline-none transition-all focus:border-[#FF1A1A]/60 focus:ring-1 focus:ring-[#FF1A1A]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D50000] px-7 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(213,0,0,0.45)] transition-all hover:bg-[#FF1A1A] disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? 'Se caută...' : 'Vezi statusul'}
              {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm font-medium text-[#FF1A1A]">{error}</p>
          )}
        </motion.form>
      </div>
    </div>
  );
}
