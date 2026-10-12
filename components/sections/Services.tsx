'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import ServiceModal from '@/components/ServiceModal';
import { SERVICES } from '@/lib/services';
import type { Service } from '@/lib/services';

export default function Services() {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <section
      id="servicii"
      className="relative overflow-hidden bg-[#0B0B0B] py-24 md:py-32"
      aria-label="Serviciile noastre"
    >
      <div
        className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.1),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Servicii"
          title="Serviciile noastre"
          subtitle="Tot ce ai nevoie pentru ca mașina ta să funcționeze și să arate impecabil."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-500 md:hover:-translate-y-2 md:hover:border-[#FF1A1A]/40 md:hover:bg-white/[0.05] md:hover:shadow-[0_20px_60px_-15px_rgba(213,0,0,0.4)]"
              >
                <Link
                  href={`/servicii/${service.slug}`}
                  className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1A1A]/70"
                  aria-label={`Mergi la pagina ${service.title}`}
                />

                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,26,26,0.3), transparent 40%, transparent 60%, rgba(255,26,26,0.3))',
                  }}
                  aria-hidden="true"
                />

                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#D50000]/20 to-transparent text-[#FF1A1A] ring-1 ring-white/10 transition-transform duration-500 md:group-hover:scale-110 md:group-hover:shadow-[0_0_25px_rgba(255,26,26,0.4)]">
                  <Icon className="h-7 w-7 transition-transform duration-500 md:group-hover:-rotate-6" aria-hidden="true" />
                </div>

                <h3 className="font-display text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">{service.short}</p>

                <div className="relative mt-5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-[#FF1A1A] opacity-0 transition-all duration-300 md:group-hover:opacity-100">
                    <span>Vezi pagina</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 md:group-hover:translate-x-1" aria-hidden="true" />
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelected(service)}
                    className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A0A0A0] transition-all md:hover:border-[#FF1A1A]/50 md:hover:bg-white/10 md:hover:text-white"
                    aria-label={`Deschide detalii rapide: ${service.title}`}
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ServiceModal service={selected} onClose={() => setSelected(null)} />
    </section>
  );
}