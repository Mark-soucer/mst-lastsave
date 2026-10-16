import type { Metadata } from 'next';
import CookieSettingsButton from '@/components/cookies/CookieSettingsButton';

export const metadata: Metadata = {
  title: 'Politica cookie-urilor | Automotive MST',
  description: 'Ce cookie-uri și tehnologii de stocare folosește site-ul Automotive MST și cum le poți controla.',
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-5 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-3xl space-y-8 text-[15px] leading-relaxed text-neutral-300">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-white">Politica cookie-urilor</h1>
          <p className="mt-3 text-sm text-neutral-500">Ultima actualizare: [completează data]</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Ce sunt cookie-urile</h2>
          <p>
            Cookie-urile sunt fișiere mici pe care site-ul le salvează în browserul tău. Aceeași regulă se aplică și
            datelor salvate local (localStorage), care funcționează similar.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Ce folosim</h2>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-white/[0.04] text-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nume</th>
                  <th className="px-4 py-3 font-semibold">Tip</th>
                  <th className="px-4 py-3 font-semibold">Durată</th>
                  <th className="px-4 py-3 font-semibold">Scop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">admin_token</td>
                  <td className="px-4 py-3">Necesar</td>
                  <td className="px-4 py-3">Până la deconectare sau expirarea sesiunii</td>
                  <td className="px-4 py-3">Autentificarea în zona de administrare, folosită doar de echipa site-ului.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">mst_cookie_consent</td>
                  <td className="px-4 py-3">Necesar</td>
                  <td className="px-4 py-3">Până o ștergi din browser</td>
                  <td className="px-4 py-3">Reține alegerile tale de cookie-uri, ca să nu te întrebăm din nou.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs">_gcl_au și alte cookie-uri Google Ads</td>
                  <td className="px-4 py-3">Marketing</td>
                  <td className="px-4 py-3">Conform Google, până la 90 de zile</td>
                  <td className="px-4 py-3">
                    Măsurarea campaniilor Google Ads. Sunt setate doar dacă accepți cookie-urile de marketing.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Cum îți controlezi alegerile</h2>
          <p>
            Poți accepta sau refuza categoriile de cookie-uri din banner. Poți schimba oricând alegerea, cu butonul de
            mai jos. Poți și să ștergi cookie-urile din setările browserului.
          </p>
          <CookieSettingsButton />
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Mai multe informații</h2>
          <p>
            Pentru cum prelucrăm datele tale personale, vezi politica de confidențialitate. Pentru întrebări, ne poți
            scrie la adresa de email de pe site.
          </p>
        </section>
      </div>
    </main>
  );
}
