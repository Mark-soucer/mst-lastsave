// Textele principale ale paginii de start: valori implicite, tipuri și validare.
// Fără importuri de server, poate fi folosit și în componente client.
import { WHY_ITEMS } from './data';

export type WhyItem = { title: string; text: string };

export type HomeText = {
  hero: {
    eyebrow: string;
    tagline: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
  services: { eyebrow: string; title: string; subtitle: string };
  why: { eyebrow: string; title: string; subtitle: string; items: WhyItem[] };
  beforeAfter: { eyebrow: string; title: string; subtitle: string };
};

// Valorile actuale ale site-ului. Se folosesc dacă nu există nimic salvat în admin.
export const DEFAULT_HOME_TEXT: HomeText = {
  hero: {
    eyebrow: 'Service auto premium — Galați',
    tagline: 'Performanță. Precizie. Încredere.',
    description:
      'Service auto premium în Galați pentru mecanică, tinichigerie, vopsitorie, geometrie și vulcanizare.',
    primaryButton: 'Programează-te Online',
    secondaryButton: 'Descoperă serviciile',
  },
  services: {
    eyebrow: 'Servicii',
    title: 'Serviciile noastre',
    subtitle: 'Tot ce ai nevoie pentru ca mașina ta să funcționeze și să arate impecabil.',
  },
  why: {
    eyebrow: 'De ce noi',
    title: 'De ce MST SERVICE?',
    subtitle:
      'O echipă dedicată, echipamente profesionale și lucrări care sunt făcute corect, de prima dată.',
    items: WHY_ITEMS.map((i) => ({ title: i.title, text: i.text })),
  },
  beforeAfter: {
    eyebrow: 'Înainte & După',
    title: 'Lucrări care vorbesc de la sine',
    subtitle: 'Vezi transformările realizate de echipa MST Service.',
  },
};

const MAX_LEN = 300;

/** Combină ce e salvat cu valorile implicite. Câmpurile goale revin la valoarea din cod. */
export function mergeHomeText(stored: unknown): HomeText {
  const s = (stored ?? {}) as Record<string, any>;
  const pick = (value: unknown, fallback: string): string =>
    typeof value === 'string' && value.trim() ? value : fallback;

  const d = DEFAULT_HOME_TEXT;
  const storedItems: any[] = Array.isArray(s.why?.items) ? s.why.items : [];

  return {
    hero: {
      eyebrow: pick(s.hero?.eyebrow, d.hero.eyebrow),
      tagline: pick(s.hero?.tagline, d.hero.tagline),
      description: pick(s.hero?.description, d.hero.description),
      primaryButton: pick(s.hero?.primaryButton, d.hero.primaryButton),
      secondaryButton: pick(s.hero?.secondaryButton, d.hero.secondaryButton),
    },
    services: {
      eyebrow: pick(s.services?.eyebrow, d.services.eyebrow),
      title: pick(s.services?.title, d.services.title),
      subtitle: pick(s.services?.subtitle, d.services.subtitle),
    },
    why: {
      eyebrow: pick(s.why?.eyebrow, d.why.eyebrow),
      title: pick(s.why?.title, d.why.title),
      subtitle: pick(s.why?.subtitle, d.why.subtitle),
      items: d.why.items.map((item, i) => ({
        title: pick(storedItems[i]?.title, item.title),
        text: pick(storedItems[i]?.text, item.text),
      })),
    },
    beforeAfter: {
      eyebrow: pick(s.beforeAfter?.eyebrow, d.beforeAfter.eyebrow),
      title: pick(s.beforeAfter?.title, d.beforeAfter.title),
      subtitle: pick(s.beforeAfter?.subtitle, d.beforeAfter.subtitle),
    },
  };
}

/** Validează datele din admin. Aruncă o eroare cu mesaj în română. */
export function validateHomeText(input: unknown): HomeText {
  if (!input || typeof input !== 'object') throw new Error('Date invalide.');
  const o = input as Record<string, any>;

  const req = (value: unknown, label: string): string => {
    const v = typeof value === 'string' ? value.trim() : '';
    if (!v) throw new Error(`Câmpul „${label}” nu poate fi gol.`);
    if (v.length > MAX_LEN) throw new Error(`Câmpul „${label}” este prea lung (max ${MAX_LEN} caractere).`);
    return v;
  };

  const d = DEFAULT_HOME_TEXT;
  const items = Array.isArray(o.why?.items) ? o.why.items : [];
  if (items.length !== d.why.items.length) throw new Error('Lista „De ce noi” trebuie să aibă același număr de elemente.');

  return {
    hero: {
      eyebrow: req(o.hero?.eyebrow, 'Hero – eticheta'),
      tagline: req(o.hero?.tagline, 'Hero – titlul'),
      description: req(o.hero?.description, 'Hero – descrierea'),
      primaryButton: req(o.hero?.primaryButton, 'Hero – buton principal'),
      secondaryButton: req(o.hero?.secondaryButton, 'Hero – buton secundar'),
    },
    services: {
      eyebrow: req(o.services?.eyebrow, 'Servicii – eticheta'),
      title: req(o.services?.title, 'Servicii – titlul'),
      subtitle: req(o.services?.subtitle, 'Servicii – subtitlul'),
    },
    why: {
      eyebrow: req(o.why?.eyebrow, 'De ce noi – eticheta'),
      title: req(o.why?.title, 'De ce noi – titlul'),
      subtitle: req(o.why?.subtitle, 'De ce noi – subtitlul'),
      items: items.map((item: any, i: number) => ({
        title: req(item?.title, `De ce noi ${i + 1} – titlu`),
        text: req(item?.text, `De ce noi ${i + 1} – text`),
      })),
    },
    beforeAfter: {
      eyebrow: req(o.beforeAfter?.eyebrow, 'Înainte & După – eticheta'),
      title: req(o.beforeAfter?.title, 'Înainte & După – titlul'),
      subtitle: req(o.beforeAfter?.subtitle, 'Înainte & După – subtitlul'),
    },
  };
}
