import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politica de confidențialitate | Automotive MST',
  description: 'Cum prelucrăm datele tale personale atunci când folosești site-ul Automotive MST.',
};

// VERSIUNE DE TEST. Textele între [paranteze] trebuie completate cu datele reale ale firmei.
export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-5 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-3xl space-y-8 text-[15px] leading-relaxed text-neutral-300">
        <header>
          <h1 className="text-3xl font-black tracking-tight text-white">Politica de confidențialitate</h1>
          <p className="mt-3 text-sm text-neutral-500">Versiune de test. Ultima actualizare: [completează data]</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Operatorul datelor</h2>
          <p>
            Datele tale personale sunt prelucrate de [DENUMIRE FIRMĂ], cu sediul în [ADRESA SEDIULUI], CUI [CUI],
            înregistrată la Registrul Comerțului cu nr. [NR. ORC]. Ne poți contacta la [EMAIL] sau [TELEFON].
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Ce date colectăm</h2>
          <p>
            Când faci o programare, colectăm numele, numărul de telefon, datele mașinii (marcă, model, an) și, dacă le
            scrii, observațiile tale. Când ne contactezi sau folosești formularele de pe site, prelucrăm datele pe care
            ni le trimiți.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">De ce le folosim și pe ce bază</h2>
          <p>
            Le folosim ca să programăm și să confirmăm intervenția, să te contactăm despre mașina ta și să ținem evidența
            lucrărilor efectuate. Baza legală este acordul tău, exprimat prin bifa de la programare, și executarea
            serviciilor solicitate.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Cât timp le păstrăm</h2>
          <p>[COMPLETEAZĂ: de exemplu, datele de programare se păstrează X luni, iar documentele fiscale conform legii.]</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Cui le transmitem</h2>
          <p>
            Datele sunt găzduite de furnizori care ne ajută să funcționăm site-ul, de exemplu Supabase (baza de date) și
            Vercel (găzduire). [COMPLETEAZĂ cu alți destinatari, dacă există.]
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Drepturile tale</h2>
          <p>
            Ai dreptul de acces, rectificare, ștergere, restricționare, opoziție și portabilitate a datelor. Poți
            retrage oricând acordul, fără ca retragerea să afecteze prelucrările făcute până atunci. Ai și dreptul să
            depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP),
            pe dataprotection.ro.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">Cookie-uri</h2>
          <p>
            Despre cookie-uri și alegerile tale, vezi <a href="/politica-cookie" className="text-[#FF1A1A] underline underline-offset-2">Politica cookie-urilor</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
