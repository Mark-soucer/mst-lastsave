// Textele editabile din admin: valori implicite, tipuri, îmbinare și validare.
// Fără importuri de server, poate fi folosit și în componente client.
import { WHY_ITEMS } from './data';
import { SERVICE_PAGES, type ServicePageData } from './service-data';

export type WhyItem = { title: string; text: string };
export type ServiceCardText = { slug: string; title: string; short: string };
export type ServiceIncludeText = { title: string; text: string };
export type ServiceFaqText = { question: string; answer: string };

export type ServicePageText = {
  heroImage: { src: string; alt: string; ratio?: number };
  heroSubtitle: string;
  intro: { what: string[]; when: string[]; problems: string[] };
  includes: ServiceIncludeText[];
  faq: ServiceFaqText[];
  cta: { title: string; subtitle: string; buttonLabel: string };
};

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
  serviceCards: ServiceCardText[];
  servicePages: Record<string, ServicePageText>;
};

function defaultServicePage(s: ServicePageData): ServicePageText {
  return {
    heroImage: { src: s.heroImage, alt: s.heroImageAlt },
    heroSubtitle: s.heroSubtitle,
    intro: { what: [...s.intro.what], when: [...s.intro.when], problems: [...s.intro.problems] },
    includes: s.includes.map((f) => ({ title: f.title, text: f.text })),
    faq: s.faq.map((f) => ({ question: f.question, answer: f.answer })),
    cta: { ...s.cta },
  };
}

const DEFAULT_SERVICE_PAGES: Record<string, ServicePageText> = Object.fromEntries(
  SERVICE_PAGES.map((s) => [s.slug, defaultServicePage(s)])
);

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
  serviceCards: SERVICE_PAGES.map((s) => ({ slug: s.slug, title: s.title, short: s.short })),
  servicePages: DEFAULT_SERVICE_PAGES,
};

const MAX_LEN = 300;
const MAX_LONG = 1000;
const MAX_LIST = 15;

const pick = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.trim() ? value : fallback;

function strList(v: unknown, fb: string[]): string[] {
  if (!Array.isArray(v)) return fb;
  const out = v
    .filter((x): x is string => typeof x === 'string' && x.trim() !== '')
    .map((x) => x.trim());
  return out.length ? out : fb;
}

function mergeServicePage(stored: any, d: ServicePageText): ServicePageText {
  const includes: ServiceIncludeText[] = Array.isArray(stored?.includes)
    ? stored.includes
        .filter((x: any) => typeof x?.title === 'string' && x.title.trim() && typeof x?.text === 'string' && x.text.trim())
        .map((x: any) => ({ title: x.title.trim(), text: x.text.trim() }))
    : [];
  const faq: ServiceFaqText[] = Array.isArray(stored?.faq)
    ? stored.faq
        .filter((x: any) => typeof x?.question === 'string' && x.question.trim() && typeof x?.answer === 'string' && x.answer.trim())
        .map((x: any) => ({ question: x.question.trim(), answer: x.answer.trim() }))
    : [];

  return {
    heroImage: {
      src: pick(stored?.heroImage?.src, d.heroImage.src),
      alt: pick(stored?.heroImage?.alt, d.heroImage.alt),
      ratio: typeof stored?.heroImage?.ratio === 'number' && stored.heroImage.ratio > 0.2 && stored.heroImage.ratio < 5 ? stored.heroImage.ratio : d.heroImage.ratio,
    },
    heroSubtitle: pick(stored?.heroSubtitle, d.heroSubtitle),
    intro: {
      what: strList(stored?.intro?.what, d.intro.what),
      when: strList(stored?.intro?.when, d.intro.when),
      problems: strList(stored?.intro?.problems, d.intro.problems),
    },
    includes: includes.length ? includes : d.includes,
    faq: faq.length ? faq : d.faq,
    cta: {
      title: pick(stored?.cta?.title, d.cta.title),
      subtitle: pick(stored?.cta?.subtitle, d.cta.subtitle),
      buttonLabel: pick(stored?.cta?.buttonLabel, d.cta.buttonLabel),
    },
  };
}

/** Combină ce e salvat cu valorile implicite. Câmpurile goale revin la valoarea din cod. */
export function mergeHomeText(stored: unknown): HomeText {
  const s = (stored ?? {}) as Record<string, any>;
  const d = DEFAULT_HOME_TEXT;
  const storedItems: any[] = Array.isArray(s.why?.items) ? s.why.items : [];
  const storedCards: any[] = Array.isArray(s.serviceCards) ? s.serviceCards : [];

  const servicePages: Record<string, ServicePageText> = {};
  for (const slug of Object.keys(DEFAULT_SERVICE_PAGES)) {
    servicePages[slug] = mergeServicePage(s.servicePages?.[slug], DEFAULT_SERVICE_PAGES[slug]);
  }

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
    serviceCards: d.serviceCards.map((card, i) => {
      const stored = storedCards.find((c) => c?.slug === card.slug) ?? storedCards[i];
      return {
        slug: card.slug,
        title: pick(stored?.title, card.title),
        short: pick(stored?.short, card.short),
      };
    }),
    servicePages,
  };
}

function validateServicePage(input: any, name: string): ServicePageText {
  const req = (v: unknown, label: string, max = MAX_LEN): string => {
    const t = typeof v === 'string' ? v.trim() : '';
    if (!t) throw new Error(`${name} – „${label}” nu poate fi gol.`);
    if (t.length > max) throw new Error(`${name} – „${label}” este prea lung.`);
    return t;
  };
  const list = (v: unknown, label: string): string[] => {
    if (!Array.isArray(v) || v.length === 0) throw new Error(`${name} – „${label}” trebuie să aibă cel puțin un rând.`);
    if (v.length > MAX_LIST) throw new Error(`${name} – „${label}” poate avea cel mult ${MAX_LIST} rânduri.`);
    return v.map((x, i) => req(x, `${label} – rândul ${i + 1}`, MAX_LONG));
  };

  const includes = Array.isArray(input?.includes) ? input.includes : [];
  if (includes.length === 0 || includes.length > MAX_LIST) throw new Error(`${name} – „Ce include” trebuie să aibă între 1 și ${MAX_LIST} rânduri.`);
  const faq = Array.isArray(input?.faq) ? input.faq : [];
  if (faq.length === 0 || faq.length > MAX_LIST) throw new Error(`${name} – „Întrebări frecvente” trebuie să aibă între 1 și ${MAX_LIST} rânduri.`);

  const src = req(input?.heroImage?.src, 'Poza principală', 500);
  if (!/^(\/|https:\/\/)/.test(src)) throw new Error(`${name} – poza principală trebuie să fie un link valid.`);

  return {
    heroImage: {
      src,
      alt: req(input?.heroImage?.alt, 'Poza principală – descriere', MAX_LEN),
      ratio: typeof input?.heroImage?.ratio === 'number' && input.heroImage.ratio > 0.2 && input.heroImage.ratio < 5 ? input.heroImage.ratio : undefined,
    },
    heroSubtitle: req(input?.heroSubtitle, 'Subtitlul din pagină', MAX_LONG),
    intro: {
      what: list(input?.intro?.what, 'Ce presupune'),
      when: list(input?.intro?.when, 'Când este necesar'),
      problems: list(input?.intro?.problems, 'Ce probleme rezolvăm'),
    },
    includes: includes.map((x: any, i: number) => ({
      title: req(x?.title, `Ce include ${i + 1} – titlu`),
      text: req(x?.text, `Ce include ${i + 1} – text`, MAX_LONG),
    })),
    faq: faq.map((x: any, i: number) => ({
      question: req(x?.question, `Întrebarea ${i + 1}`),
      answer: req(x?.answer, `Răspunsul ${i + 1}`, MAX_LONG),
    })),
    cta: {
      title: req(input?.cta?.title, 'Caseta finală – titlul'),
      subtitle: req(input?.cta?.subtitle, 'Caseta finală – subtitlul', MAX_LONG),
      buttonLabel: req(input?.cta?.buttonLabel, 'Caseta finală – butonul'),
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
  const cards = Array.isArray(o.serviceCards) ? o.serviceCards : [];
  if (cards.length !== d.serviceCards.length) throw new Error('Lista de servicii trebuie să aibă același număr de carduri.');

  const servicePages: Record<string, ServicePageText> = {};
  for (const slug of Object.keys(DEFAULT_SERVICE_PAGES)) {
    const name = SERVICE_PAGES.find((s) => s.slug === slug)?.title ?? slug;
    servicePages[slug] = validateServicePage(o.servicePages?.[slug], name);
  }

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
    serviceCards: d.serviceCards.map((card, i) => ({
      slug: card.slug,
      title: req(cards[i]?.title, `Card serviciu ${i + 1} – titlu`),
      short: req(cards[i]?.short, `Card serviciu ${i + 1} – descriere`),
    })),
    servicePages,
  };
}

/** Aplică textele editate din admin peste datele din cod ale unei pagini de serviciu. */
export function applyServiceText(page: ServicePageData, text: HomeText): ServicePageData {
  const t = text.servicePages[page.slug];
  const card = text.serviceCards.find((c) => c.slug === page.slug);
  if (!t) return page;

  return {
    ...page,
    title: card?.title ?? page.title,
    short: card?.short ?? page.short,
    heroImage: t.heroImage.src,
    heroImageAlt: t.heroImage.alt,
    heroRatio: t.heroImage.ratio,
    heroSubtitle: t.heroSubtitle,
    intro: t.intro,
    includes: t.includes.map((inc, i) => ({
      icon: page.includes[i]?.icon ?? 'wrench',
      title: inc.title,
      text: inc.text,
    })),
    faq: t.faq,
    cta: t.cta,
  };
}
