export type BeforeAfterCategory =
  | 'Tinichigerie'
  | 'Vopsitorie'
  | 'Polish'
  | 'Detailing'
  | 'Mecanică';

export type BeforeAfterProject = {
  id: string;
  title: string;
  category: BeforeAfterCategory;
  vehicle: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  /** Marchează proiectele demo, care nu reprezintă lucrări reale MST Service. */
  demo?: boolean;
};

export const BEFORE_AFTER_FILTERS = [
  'Toate',
  'Tinichigerie',
  'Vopsitorie',
] as const;

/**
 * Date demo pentru secțiunea Înainte/După.
 * Pentru lucrări reale, înlocuiește imaginile, descrierile și elimină `demo: true`.
 */
export const BEFORE_AFTER_PROJECTS: BeforeAfterProject[] = [
  {
    id: 'bmw-seria-3-tinichigerie',
    title: 'BMW Seria 3 — Tinichigerie & vopsitorie',
    category: 'Tinichigerie',
    vehicle: 'BMW Seria 3',
    description:
      'Demo: Redresare aripă față, chituire, grunduire și vopsire în nuanța originală, cu finisaj lucios uniform.',
    beforeImage: '/images/before-01.svg',
    afterImage: '/images/after-01.svg',
    demo: true,
  },
  {
    id: 'ford-focus-reparatie-caroserie',
    title: 'Ford Focus — Reparație caroserie',
    category: 'Tinichigerie',
    vehicle: 'Ford Focus',
    description:
      'Demo: Îndreptare ușă și prag, verificare geometrie caroserie și pregătire completă pentru vopsitorie.',
    beforeImage: '/images/bodywork-01.svg',
    afterImage: '/images/bodywork-02.svg',
    demo: true,
  },
  {
    id: 'vw-golf-vopsitorie-capota',
    title: 'VW Golf — Vopsitorie capotă',
    category: 'Vopsitorie',
    vehicle: 'Volkswagen Golf 7',
    description:
      'Demo: Vopsire capotă cu potrivire computerizată a nuanței, aplicare lac și finisare prin lustruire.',
    beforeImage: '/images/paint-02.svg',
    afterImage: '/images/paint-01.svg',
    demo: true,
  },
];

