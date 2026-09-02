'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ArrowUp } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#060606] pt-16 pb-12 text-[#A0A0A0]">
      {/* Background glow accent */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[250px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,0,0,0.08),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Brand & Bio */}
          <div>
            <Link href="#acasa" className="inline-block transition-transform hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-mst-transparent.png"
                alt="MST SERVICE"
                className="h-10 w-auto object-contain drop-shadow-[0_2px_12px_rgba(255,26,26,0.3)]"
              />
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-[#888]">
              Service auto premium în Galați. Specializați în mecanică completă, tinichigerie,
              vopsitorie profesională, reglaj direcție și vulcanizare.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-[#FF1A1A]" />
              Garanție pentru toate lucrările executate
            </div>
          </div>

          {/* Col 2: Servicii rapide */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Servicii Principale
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="#servicii" className="transition-colors hover:text-white">
                  Mecanică auto & Diagnoză
                </Link>
              </li>
              <li>
                <Link href="#servicii" className="transition-colors hover:text-white">
                  Tinichigerie & Îndreptare
                </Link>
              </li>
              <li>
                <Link href="#servicii" className="transition-colors hover:text-white">
                  Vopsitorie în cabină
                </Link>
              </li>
              <li>
                <Link href="#servicii" className="transition-colors hover:text-white">
                  Geometrie roți 3D
                </Link>
              </li>
              <li>
                <Link href="#servicii" className="transition-colors hover:text-white">
                  Dosare daune RCA
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Program de lucru */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Program Atelier
            </h4>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[#FF1A1A]" />
                <div>
                  <span className="font-semibold text-white">Luni – Vineri:</span>
                  <p className="text-[#888]">08:00 – 16:30</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 shrink-0 text-[#555]" />
                <div>
                  <span className="font-semibold text-white">Sâmbătă – Duminică:</span>
                  <p className="text-[#888]">Închis (Urgențe la telefon)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Locație */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
              Locație & Contact
            </h4>
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#FF1A1A]" />
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {BUSINESS.address.full}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#FF1A1A]" />
                <a href={BUSINESS.phoneHref} className="font-bold text-white transition-colors hover:text-[#FF1A1A]">
                  {BUSINESS.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#FF1A1A]" />
                <a href={`mailto:${BUSINESS.email}`} className="transition-colors hover:text-white">
                  {BUSINESS.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Admin Link */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-[#777]">
          <p>© {new Date().getFullYear()} MST SERVICE Galați. Toate drepturile rezervate.</p>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-[#A0A0A0] transition-colors hover:text-white"
            >
              Sus
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

