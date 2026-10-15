'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import AdminTabs from '@/components/admin/AdminTabs';
import type { HomeText, ServicePageText } from '@/lib/site-text-shared';

type Feedback = { type: 'ok' | 'error'; text: string } | null;

const inputClass =
  'w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#FF1A1A]/60 focus:outline-none';
const areaClass = `${inputClass} min-h-[84px]`;

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-neutral-400">{label}</span>
      {multiline ? (
        <textarea className={areaClass} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

/** Listă de rânduri simple (ex: „Ce presupune”). Poți adăuga și șterge rânduri. */
function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="md:col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-400">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-white/20 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Adaugă rând
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={inputClass}
            value={item}
            onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            aria-label="Șterge rândul"
            className="shrink-0 rounded-lg border border-white/10 px-3 text-neutral-400 hover:border-[#FF1A1A]/50 hover:text-[#FF1A1A]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Listă de perechi (titlu + text, sau întrebare + răspuns). */
function PairEditor<T extends Record<string, string>>({
  label,
  items,
  onChange,
  fields,
  empty,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  fields: { key: keyof T & string; label: string; multiline?: boolean }[];
  empty: T;
}) {
  return (
    <div className="md:col-span-2 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-300">{label}</span>
        <button
          type="button"
          onClick={() => onChange([...items, { ...empty }])}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:border-white/20 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" /> Adaugă
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
          {fields.map((f) => (
            <Field
              key={f.key}
              label={f.label}
              multiline={f.multiline}
              value={item[f.key]}
              onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, [f.key]: v } : x)))}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="justify-self-end text-xs text-neutral-400 hover:text-[#FF1A1A]"
          >
            Șterge
          </button>
        </div>
      ))}
    </div>
  );
}

function ServiceEditor({
  name,
  value,
  onChange,
  onUpload,
}: {
  name: string;
  value: ServicePageText;
  onChange: (v: ServicePageText) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await onUpload(file);
      onChange({ ...value, heroImage: { ...value.heroImage, src: url } });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Încărcarea a eșuat.');
    } finally {
      setUploading(false);
    }
  };
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <summary className="cursor-pointer text-lg font-bold">{name}</summary>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2 grid gap-4 rounded-xl border border-white/5 bg-black/20 p-4 md:grid-cols-[160px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.heroImage.src} alt={value.heroImage.alt} className="h-full w-full object-contain p-2" />
          </div>
          <div className="space-y-3">
            <span className="text-sm text-neutral-400">Poza principală</span>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-neutral-200 hover:border-white/20">
              {uploading ? 'Se încarcă...' : 'Schimbă poza'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="hidden"
                disabled={uploading}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            {uploadError && <p className="text-sm text-red-300">{uploadError}</p>}
            <Field
              label="Descrierea pozei (pentru Google și persoanele cu deficiențe de vedere)"
              value={value.heroImage.alt}
              onChange={(v) => onChange({ ...value, heroImage: { ...value.heroImage, alt: v } })}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <Field
            label="Subtitlul din pagină"
            multiline
            value={value.heroSubtitle}
            onChange={(v) => onChange({ ...value, heroSubtitle: v })}
          />
        </div>

        <ListEditor
          label="Ce presupune"
          items={value.intro.what}
          onChange={(items) => onChange({ ...value, intro: { ...value.intro, what: items } })}
        />
        <ListEditor
          label="Când este necesar"
          items={value.intro.when}
          onChange={(items) => onChange({ ...value, intro: { ...value.intro, when: items } })}
        />
        <ListEditor
          label="Ce probleme rezolvăm"
          items={value.intro.problems}
          onChange={(items) => onChange({ ...value, intro: { ...value.intro, problems: items } })}
        />

        <PairEditor
          label="Ce include (cartonașele)"
          items={value.includes}
          onChange={(items) => onChange({ ...value, includes: items })}
          fields={[
            { key: 'title', label: 'Titlu' },
            { key: 'text', label: 'Text', multiline: true },
          ]}
          empty={{ title: '', text: '' }}
        />

        <PairEditor
          label="Întrebări frecvente"
          items={value.faq}
          onChange={(items) => onChange({ ...value, faq: items })}
          fields={[
            { key: 'question', label: 'Întrebarea' },
            { key: 'answer', label: 'Răspunsul', multiline: true },
          ]}
          empty={{ question: '', answer: '' }}
        />

        <div className="md:col-span-2 text-sm font-semibold text-neutral-300">Caseta de la final</div>
        <Field label="Titlu" value={value.cta.title} onChange={(v) => onChange({ ...value, cta: { ...value.cta, title: v } })} />
        <Field label="Buton" value={value.cta.buttonLabel} onChange={(v) => onChange({ ...value, cta: { ...value.cta, buttonLabel: v } })} />
        <div className="md:col-span-2">
          <Field label="Subtitlu" multiline value={value.cta.subtitle} onChange={(v) => onChange({ ...value, cta: { ...value.cta, subtitle: v } })} />
        </div>
      </div>
    </details>
  );
}

export default function AdminSitePage() {
  const [form, setForm] = useState<HomeText | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    fetch('/api/site-content/home', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setForm(json.data);
        else setFeedback({ type: 'error', text: 'Nu s-au putut încărca textele.' });
      })
      .catch(() => setFeedback({ type: 'error', text: 'Nu s-au putut încărca textele.' }))
      .finally(() => setLoading(false));
  }, []);

  const set = <S extends keyof HomeText>(section: S, key: keyof HomeText[S], value: string) =>
    setForm((f) => (f ? { ...f, [section]: { ...(f[section] as object), [key]: value } } : f));

  const setItem = (index: number, key: 'title' | 'text', value: string) =>
    setForm((f) =>
      f
        ? {
            ...f,
            why: {
              ...f.why,
              items: f.why.items.map((it, i) => (i === index ? { ...it, [key]: value } : it)),
            },
          }
        : f
    );

  const setCard = (index: number, key: 'title' | 'short', value: string) =>
    setForm((f) =>
      f
        ? {
            ...f,
            serviceCards: f.serviceCards.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
          }
        : f
    );

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/site-content/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Încărcarea a eșuat.');
    return json.url as string;
  };

  const setServicePage = (slug: string, value: ServicePageText) =>
    setForm((f) => (f ? { ...f, servicePages: { ...f.servicePages, [slug]: value } } : f));

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/site-content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      setFeedback(
        json.success
          ? { type: 'ok', text: 'Modificările au fost salvate. Site-ul este actualizat.' }
          : { type: 'error', text: json.message || 'Salvarea a eșuat.' }
      );
    } catch {
      setFeedback({ type: 'error', text: 'Salvarea a eșuat. Verifică conexiunea.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 pb-20 pt-28 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-black uppercase tracking-tight">Admin</h1>
        <AdminTabs />

        {loading || !form ? (
          <div className="flex items-center gap-2 text-neutral-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Se încarcă...
          </div>
        ) : (
          <div className="space-y-6">
            <Section title="Hero (prima secțiune)">
              <Field label="Eticheta de sus" value={form.hero.eyebrow} onChange={(v) => set('hero', 'eyebrow', v)} />
              <Field label="Titlul" value={form.hero.tagline} onChange={(v) => set('hero', 'tagline', v)} />
              <div className="md:col-span-2">
                <Field label="Descriere" value={form.hero.description} onChange={(v) => set('hero', 'description', v)} multiline />
              </div>
              <Field label="Buton principal" value={form.hero.primaryButton} onChange={(v) => set('hero', 'primaryButton', v)} />
              <Field label="Buton secundar" value={form.hero.secondaryButton} onChange={(v) => set('hero', 'secondaryButton', v)} />
            </Section>

            <Section title="Secțiunea Servicii">
              <Field label="Eticheta" value={form.services.eyebrow} onChange={(v) => set('services', 'eyebrow', v)} />
              <Field label="Titlul" value={form.services.title} onChange={(v) => set('services', 'title', v)} />
              <div className="md:col-span-2">
                <Field label="Subtitlu" value={form.services.subtitle} onChange={(v) => set('services', 'subtitle', v)} multiline />
              </div>
            </Section>

            <Section title="Cardurile de servicii (grila de pe pagina de start)">
              {form.serviceCards.map((card, i) => (
                <div key={card.slug} className="md:col-span-2 grid gap-4 rounded-xl border border-white/5 bg-black/20 p-4 md:grid-cols-2">
                  <Field label={`Serviciu ${i + 1} – titlu`} value={card.title} onChange={(v) => setCard(i, 'title', v)} />
                  <Field label={`Serviciu ${i + 1} – descriere scurtă`} value={card.short} onChange={(v) => setCard(i, 'short', v)} multiline />
                </div>
              ))}
            </Section>

            <Section title="Secțiunea De ce noi">
              <Field label="Eticheta" value={form.why.eyebrow} onChange={(v) => set('why', 'eyebrow', v)} />
              <Field label="Titlul" value={form.why.title} onChange={(v) => set('why', 'title', v)} />
              <div className="md:col-span-2">
                <Field label="Subtitlu" value={form.why.subtitle} onChange={(v) => set('why', 'subtitle', v)} multiline />
              </div>
              {form.why.items.map((item, i) => (
                <div key={i} className="md:col-span-2 grid gap-4 rounded-xl border border-white/5 bg-black/20 p-4 md:grid-cols-2">
                  <Field label={`Punct ${i + 1} – titlu`} value={item.title} onChange={(v) => setItem(i, 'title', v)} />
                  <Field label={`Punct ${i + 1} – text`} value={item.text} onChange={(v) => setItem(i, 'text', v)} />
                </div>
              ))}
            </Section>

            <div className="space-y-3">
              <h2 className="text-lg font-bold">Paginile serviciilor</h2>
              <p className="text-sm text-neutral-400">
                Apasă pe un serviciu ca să-i editezi conținutul. Același text apare și în fereastra care se deschide din card.
              </p>
              {form.serviceCards.map((card) => (
                <ServiceEditor
                  key={card.slug}
                  name={card.title}
                  value={form.servicePages[card.slug]}
                  onChange={(v) => setServicePage(card.slug, v)}
                  onUpload={uploadImage}
                />
              ))}
            </div>

            <Section title="Secțiunea Înainte & După">
              <Field label="Eticheta" value={form.beforeAfter.eyebrow} onChange={(v) => set('beforeAfter', 'eyebrow', v)} />
              <Field label="Titlul" value={form.beforeAfter.title} onChange={(v) => set('beforeAfter', 'title', v)} />
              <div className="md:col-span-2">
                <Field label="Subtitlu" value={form.beforeAfter.subtitle} onChange={(v) => set('beforeAfter', 'subtitle', v)} multiline />
              </div>
            </Section>

            {feedback && (
              <p
                className={`rounded-lg px-4 py-3 text-sm ${
                  feedback.type === 'ok'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border border-[#FF1A1A]/40 bg-[#FF1A1A]/10 text-red-300'
                }`}
              >
                {feedback.text}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D50000] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#FF1A1A] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Se salvează...' : 'Salvează'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
