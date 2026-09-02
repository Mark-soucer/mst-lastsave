import Link from 'next/link';
import { ArrowLeft, MessageCircle, Phone, SearchX } from 'lucide-react';
import { BUSINESS } from '@/lib/data';

export default function StatusNotFound() {
  const whatsAppMessage = encodeURIComponent(
    'Bună ziua! Am nevoie de informații despre statusul comenzii mele auto.'
  );
  const whatsAppUrl = `https://wa.me/40757240854?text=${whatsAppMessage}`;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080808] pt-24 pb-16">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,0,0,0.12),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#A0A0A0]">
          <SearchX className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-white md:text-3xl">
          Comanda nu a fost găsită.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
          Verifică link-ul primit sau contactează MST Service.
        </p>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(213,0,0,0.45)] transition-all hover:bg-[#FF1A1A]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Contactează MST Service
          </a>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-[#25D366]/10 px-6 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </a>
        </div>

        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 text-xs font-semibold text-[#A0A0A0] transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 text-[#FF1A1A] transition-transform group-hover:-translate-x-1" aria-hidden="true" />
          Înapoi la site-ul principal
        </Link>
      </div>
    </div>
  );
}
