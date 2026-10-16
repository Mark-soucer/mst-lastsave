import type { Metadata } from 'next';
import CookieSettingsButton from '@/components/cookies/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Politica cookie-urilor | Automotive MST',
  description: 'Ce fișiere salvăm pe telefonul sau calculatorul tău când folosești site-ul Automotive MST și cum le poți controla.',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-5 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-3xl space-y-10 text-[15px] leading-relaxed text-neutral-300">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-white">Politica cookie-urilor</h1>
          <p className="mt-3 text-sm text-neutral-500">Ultima actualizare: [completează data]</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Ce sunt cookie-urile?</h2>
          <p>
            Cookie-urile sunt mici fișiere pe care site-ul le salvează în browserul tău, ca să țină minte anumite lucruri
            despre vizita ta. De exemplu, ca să nu te întrebăm din nou ce alegeri ai făcut.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Ce folosim</h2>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white">Cookie-uri necesare</h3>
            <p className="mt-2">
              Sunt necesare ca site-ul să funcționeze. Te ajută să rămâi conectat dacă ești din echipa noastră și țin
              minte alegerile tale despre cookie-uri. Nu le poți dezactiva, deoarece fără ele site-ul nu merge bine.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold text-white">Cookie-uri de marketing</h3>
            <p className="mt-2">
              Sunt folosite de Google Ads, ca să vedem dacă reclamele noastre ajung la oameni potriviți și ca să îți
              arătăm reclame relevante pe alte site-uri. Sunt activate doar dacă ești de acord. Dacă refuzi, nu se
              încarcă nimic de la Google.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Cum îți schimbi alegerea</h2>
          <p>
            Poți accepta sau refuza cookie-urile de marketing oricând. Apasă butonul de mai jos, iar bannerul cu
            alegerile apare din nou.
          </p>
          <CookieSettingsButton />
          <p className="text-sm text-neutral-500">
            Poți șterge cookie-urile și din setările browserului. Dacă faci asta, vei fi întrebat din nou despre alegerile tale.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Mai multe informații</h2>
          <p>
            Pentru cum folosim datele tale personale, citește{' '}
            <a href="/politica-confidentialitate" className="text-[#FF1A1A] underline underline-offset-2">
              politica de confidențialitate
            </a>
            . Pentru întrebări, ne poți scrie la adresa de email de pe site.
          </p>
        </section>
      </div>
    </main>
  );
}
