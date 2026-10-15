'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import AdminTabs from '@/components/admin/AdminTabs';
import type { HomeText } from '@/lib/site-text-shared';

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
    setForm((f) => (f ? { ...f, [section]: { ...f[section], [key]: value } } : f));

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
