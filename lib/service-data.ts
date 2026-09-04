import { BEFORE_AFTER_PROJECTS } from '@/lib/projects';
import type { BeforeAfterProject } from '@/lib/projects';

export type ServiceIconName =
  | 'award'
  | 'badge-check'
  | 'battery'
  | 'car'
  | 'circle-dot'
  | 'cog'
  | 'compass'
  | 'cpu'
  | 'disc'
  | 'droplets'
  | 'eye'
  | 'gauge'
  | 'hammer'
  | 'paintbrush'
  | 'rotate-ccw'
  | 'scan'
  | 'shield'
  | 'sparkles'
  | 'wrench';

export type ServiceFeature = {
  icon: ServiceIconName;
  title: string;
  text: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceSeo = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

export type ServiceGalleryItem = {
  src: string;
  alt: string;
};

export type ServiceGallery =
  | {
    type: 'before-after';
    title: string;
    subtitle: string;
    projects: BeforeAfterProject[];
  }
  | {
    type: 'images';
    title: string;
    subtitle: string;
    images: ServiceGalleryItem[];
  };

export type ServicePageData = {
  slug: string;
  title: string;
  icon: ServiceIconName;
  short: string;
  heroImage: string;
  heroImageAlt: string;
  heroSubtitle: string;
  intro: {
    what: string[];
    when: string[];
    problems: string[];
  };
  includes: ServiceFeature[];
  faq: ServiceFaq[];
  gallery?: ServiceGallery;
  cta: {
    title: string;
    subtitle: string;
    buttonLabel: string;
  };
  appointmentServiceName: string;
  seo: ServiceSeo;
};

export const SERVICE_ADVANTAGES: ServiceFeature[] = [
  {
    icon: 'award',
    title: 'Experiență',
    text: 'Lucrăm cu atenție și respectăm specificațiile fiecărui autoturism.',
  },
  {
    icon: 'cpu',
    title: 'Echipamente moderne',
    text: 'Aparatură actualizată pentru intervenții precise și repetabile.',
  },
  {
    icon: 'scan',
    title: 'Diagnosticare profesională',
    text: 'Identificăm cauza corectă înainte de a începe reparația.',
  },
  {
    icon: 'badge-check',
    title: 'Transparență',
    text: 'Îți explicăm ce presupune lucrarea înainte de a o începe.',
  },
  {
    icon: 'eye',
    title: 'Atenție la detalii',
    text: 'Fiecare intervenție este verificată înainte de predarea mașinii.',
  },
];

const DIAGNOZA_GALLERY: ServiceGallery = {
  type: 'images',
  title: 'Diagnosticare auto',
  subtitle: 'Identificăm rapid defecțiunile cu echipamente digitale.',
  images: [
    { src: '/images/mechanic-02.svg', alt: 'Diagnosticare electronică MST SERVICE' },
    { src: '/images/mechanic-01.svg', alt: 'Verificare tehnică MST SERVICE' },
  ],
};

const TINICHIGERIE_GALLERY: ServiceGallery = {
  type: 'before-after',
  title: 'Înainte și după — tinichigerie',
  subtitle: 'Exemple de reparații caroserie realizate în atelier.',
  projects: BEFORE_AFTER_PROJECTS.filter((project) => project.category === 'Tinichigerie').slice(0, 2),
};

const VOPSITORIE_GALLERY: ServiceGallery = {
  type: 'before-after',
  title: 'Înainte și după — vopsitorie',
  subtitle: 'Finisaje auto realizate cu materiale profesionale.',
  projects: BEFORE_AFTER_PROJECTS.filter((project) => project.category === 'Vopsitorie').slice(0, 2),
};

const GEOMETRIE_GALLERY: ServiceGallery = {
  type: 'images',
  title: 'Geometrie roți',
  subtitle: 'Măsurători digitale și reglaje de direcție.',
  images: [
    { src: '/images/alignment-01.svg', alt: 'Geometrie roți MST SERVICE' },
    { src: '/images/tire-01.svg', alt: 'Echilibrare roți MST SERVICE' },
  ],
};

const VULCANIZARE_GALLERY: ServiceGallery = {
  type: 'images',
  title: 'Vulcanizare și anvelope',
  subtitle: 'Montaj, echilibrare și reparații anvelope.',
  images: [
    { src: '/images/tire-01.svg', alt: 'Vulcanizare MST SERVICE' },
    { src: '/images/alignment-01.svg', alt: 'Echilibrare roți MST SERVICE' },
  ],
};

const DAUNE_RCA_GALLERY: ServiceGallery = {
  type: 'before-after',
  title: 'Înainte și după — reparații accidente',
  subtitle: 'Redăm mașina la starea inițială după avarie.',
  projects: BEFORE_AFTER_PROJECTS.filter((project) =>
    ['Tinichigerie', 'Vopsitorie'].includes(project.category),
  ).slice(0, 2),
};

const REPARATII_GALLERY: ServiceGallery = {
  type: 'images',
  title: 'Întreținere și reparații auto',
  subtitle: 'Revizii și lucrări realizate în atelierul MST Service.',
  images: [
    { src: '/images/mechanic-01.svg', alt: 'Întreținere auto MST SERVICE' },
    { src: '/images/mechanic-02.svg', alt: 'Verificare tehnică MST SERVICE' },
  ],
};

export const SERVICE_PAGES: ServicePageData[] = [
  {
    slug: 'mecanica-auto',
    title: 'Mecanică Auto',
    icon: 'wrench',
    short: 'Diagnosticare, întreținere și reparații mecanice complete.',
    heroImage: '/images/mechanic-01.svg',
    heroImageAlt: 'Mecanică auto MST SERVICE Galați',
    heroSubtitle:
      'Diagnosticare, întreținere și reparații mecanice complete pentru autoturismul tău, executate cu precizie.',
    intro: {
      what: [
        'Serviciul de mecanică auto MST Service acoperă întreținerea periodică și reparațiile mecanice pentru toate tipurile de autoturisme. De la revizii și schimburi de ulei până la intervenții complexe pe motor, transmisie sau sisteme de siguranță, verificăm fiecare componentă înainte de a decide lucrarea necesară.',
        'Fiecare intervenție este realizată cu scule și echipamente dedicate, astfel încât mașina ta să funcționeze corect și sigur după predare.',
      ],
      when: [
        'Când apare un zgomot, o vibrație sau un martor de bord aprins.',
        'La intervalele de revizie recomandate de producător.',
        'Când simți o schimbare în comportamentul mașinii la frânare, accelerare sau virare.',
      ],
      problems: [
        'Uzura componentelor motorului și a sistemelor auxiliare.',
        'Probleme de frânare, suspensie sau direcție.',
        'Pierderi de fluide, zgomote anormale și performanță redusă.',
      ],
    },
    includes: [
      { icon: 'scan', title: 'Diagnosticare', text: 'Verificăm starea tehnică și identificăm cauza reală a problemei.' },
      { icon: 'wrench', title: 'Reparații motor', text: 'Intervenții de la distribuție până la componente interne.' },
      { icon: 'disc', title: 'Sistem de frânare', text: 'Plăcuțe, discuri, lichid de frână și verificare completă.' },
      { icon: 'gauge', title: 'Suspensie', text: 'Amortizoare, brațe, bascule, bucșe și verificarea articulațiilor.' },
      { icon: 'compass', title: 'Direcție', text: 'Casetă de direcție, capete de bară și reglaj complet.' },
      { icon: 'cog', title: 'Transmisie', text: 'Ambreiaj, cutie de viteze și transmisie finală.' },
    ],
    faq: [
      {
        question: 'Când este necesară o verificare mecanică?',
        answer:
          'La apariția zgomotelor, vibrațiilor sau a martorilor de bord, dar și la intervalele de revizie recomandate de producător.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, programarea ne ajută să alocăm timpul necesar pentru mașina ta și să reducem timpul de așteptare.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Prețul este stabilit în atelier, după o evaluare corectă a lucrărilor și pieselor necesare.',
      },
      {
        question: 'Ce mașini reparați?',
        answer:
          'Lucrăm cu autoturisme de diferite mărci și modele, în funcție de specificul lucrării.',
      },
    ],
    cta: {
      title: 'Ai nevoie de o verificare mecanică?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Mecanică auto',
    seo: {
      title: 'Mecanică Auto Galați | MST Service',
      description:
        'Servicii profesionale de mecanică auto în Galați. Diagnosticare și reparații pentru autoturisme. Programează-te la MST Service.',
    },
  },
  {
    slug: 'diagnoza-auto',
    title: 'Diagnosticare Auto',
    icon: 'scan',
    short: 'Diagnosticare electronică rapidă și precisă.',
    heroImage: '/images/mechanic-02.svg',
    heroImageAlt: 'Diagnosticare auto MST SERVICE Galați',
    heroSubtitle:
      'Identificăm rapid și precis defecțiunile electronice și mecanice, cu echipamente de diagnosticare dedicate.',
    intro: {
      what: [
        'Diagnosticarea auto presupune scanarea modulelor electronice ale mașinii, citirea erorilor stocate și interpretarea parametrilor de funcționare. Astfel, aflăm exact de unde pornește problema, nu doar simptomul.',
        'După scanare, corelăm datele cu o verificare tehnică și îți oferim un raport clar, cu recomandările echipei MST Service.',
      ],
      when: [
        'Când se aprinde un martor de bord, precum check-engine.',
        'Când mașina pornește greu, consumă diferit sau își schimbă comportamentul.',
        'Înainte de achiziția unei mașini second-hand, pentru o verificare completă.',
      ],
      problems: [
        'Erori motor și probleme de ardere sau aprindere.',
        'Defecțiuni ale senzorilor și actuatoarelor.',
        'Probleme electrice, de baterie sau de încărcare.',
      ],
    },
    includes: [
      { icon: 'scan', title: 'Scanare electronică', text: 'Citirea erorilor stocate în modulele auto.' },
      { icon: 'cpu', title: 'Testare senzori', text: 'Verificăm senzori, actuatoare și conexiuni electrice.' },
      { icon: 'eye', title: 'Inspecție vizuală', text: 'Corelăm simptomele cu starea reală a componentelor.' },
      { icon: 'battery', title: 'Sistem electric', text: 'Baterie, alternator și circuit de încărcare.' },
      { icon: 'gauge', title: 'Parametri funcționali', text: 'Analizăm valori în timp real, în diverse regimuri.' },
      { icon: 'badge-check', title: 'Raport detaliat', text: 'Primești concluzii clare și recomandări de reparație.' },
    ],
    faq: [
      {
        question: 'Cât durează o diagnoză?',
        answer:
          'Durata depinde de complexitatea problemei. Îți oferim o estimare după scanarea inițială a mașinii.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, te rugăm să te programezi pentru a evita timpii de așteptare și pentru a ne organiza eficient.',
      },
      {
        question: 'Ce obțin după diagnosticare?',
        answer:
          'Primești un raport cu erorile identificate, constatările echipei și recomandările de reparație.',
      },
      {
        question: 'Se poate șterge doar eroarea fără reparație?',
        answer:
          'Ștergerea unei erori fără remedierea cauzei duce adesea la reapariția acesteia. Îți recomandăm intervenția completă.',
      },
    ],
    gallery: DIAGNOZA_GALLERY,
    cta: {
      title: 'A apărut un martor de bord?',
      subtitle: 'Programează-ți mașina pentru o diagnosticare completă.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Diagnoză computerizată',
    seo: {
      title: 'Diagnosticare Auto Galați | MST Service',
      description:
        'Diagnosticare electronică auto în Galați. Scanare erori, testare senzori și raport detaliat. Programează-te la MST Service.',
    },
  },
  {
    slug: 'tinichigerie',
    title: 'Tinichigerie Auto',
    icon: 'car',
    short: 'Reparații caroserie și redarea formei originale.',
    heroImage: '/images/bodywork-01.svg',
    heroImageAlt: 'Tinichigerie auto MST SERVICE Galați',
    heroSubtitle:
      'Reparăm și redăm forma originală a caroseriei, corectând loviturile, adânciturile și deformările tablei.',
    intro: {
      what: [
        'Serviciul de tinichigerie auto se ocupă de repararea și refacerea caroseriei după accidente, lovituri sau coroziune. Îndreptăm tabla, corectăm deformările și pregătim suprafața pentru vopsitorie.',
        'Fiecare lucrare este realizată cu scule dedicate, astfel încât elementele caroseriei să revină la forma și aliniamentele corecte.',
      ],
      when: [
        'După un accident sau o coliziune ușoară.',
        'Când apar zgârieturi, lovituri sau adâncituri în caroserie.',
        'Când observi pete de rugină sau zone cu coroziune.',
      ],
      problems: [
        'Zone deformate după accidente sau atingeri.',
        'Zgârieturi și lovituri pe aripi, uși, capote sau praguri.',
        'Coroziunea plăcilor metalice și slăbirea structurii caroseriei.',
      ],
    },
    includes: [
      { icon: 'hammer', title: 'Îndreptare table', text: 'Redăm forma originală a elementelor caroseriei.' },
      { icon: 'car', title: 'Reparații caroserie', text: 'Aripi, uși, capote și praguri reparate corect.' },
      { icon: 'sparkles', title: 'Pregătire suprafață', text: 'Chit, grund și finisare înainte de vopsitorie.' },
      { icon: 'shield', title: 'Tratamente anticorozive', text: 'Protejăm zonele expuse ruginii.' },
      { icon: 'compass', title: 'Geometrie caroserie', text: 'Verificăm alinierile și simetriile elementelor.' },
      { icon: 'wrench', title: 'Înlocuire panouri', text: 'Montăm elemente noi sau de schimb, după caz.' },
    ],
    faq: [
      {
        question: 'Când este nevoie de tinichigerie?',
        answer:
          'După accidente, lovituri, zgârieturi adânci sau atunci când apare coroziunea pe caroserie.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, programează-te pentru o evaluare a lucrării și o estimare corectă a intervenției.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Prețul se stabilește după evaluarea zonei afectate, a manoperei și a materialelor necesare.',
      },
      {
        question: 'Lucrarea se poate face fără vopsire?',
        answer:
          'În funcție de avarie, unele zone pot fi remediate doar prin tinichigerie. Echipa îți spune exact ce este necesar.',
      },
    ],
    gallery: TINICHIGERIE_GALLERY,
    cta: {
      title: 'Ai o zgârietură sau o lovitură?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Tinichigerie',
    seo: {
      title: 'Tinichigerie Auto Galați | MST Service',
      description:
        'Reparații tinichigerie auto în Galați: îndreptare table, caroserie și pregătire pentru vopsitorie. Programează-te la MST Service.',
    },
  },
  {
    slug: 'vopsitorie-auto',
    title: 'Vopsitorie Auto',
    icon: 'paintbrush',
    short: 'Vopsire completă sau parțială, cu finisaje profesionale.',
    heroImage: '/images/paint-01.svg',
    heroImageAlt: 'Vopsitorie auto MST SERVICE Galați',
    heroSubtitle:
      'Finisaje auto impecabile, cu materiale profesionale și o culoare uniformă, durabilă în timp.',
    intro: {
      what: [
        'Vopsitoria auto presupune pregătirea suprafeței, aplicarea culorii și protejarea cu lac pentru un finisaj uniform. Lucrăm atât vopsire integrală, cât și pe zone, în funcție de starea mașinii.',
        'Folosim materiale de calitate și respectăm pașii de pregătire, astfel încât rezultatul final să arate impecabil și să reziste în timp.',
      ],
      when: [
        'Când vopseaua este decolorată, zgâriată sau deteriorată.',
        'După lucrări de tinichigerie sau înlocuirea unor elemente de caroserie.',
        'Când dorești reîmprospătarea aspectului mașinii tale.',
      ],
      problems: [
        'Culoare decolorată sau neuniformă.',
        'Zgârieturi superficiale și lac deteriorat.',
        'Retușuri pe zone reparate sau elemente schimbate.',
      ],
    },
    includes: [
      { icon: 'paintbrush', title: 'Vopsire completă', text: 'Aplicare uniformă pe întreaga caroserie.' },
      { icon: 'sparkles', title: 'Vopsire pe zone', text: 'Aripi, capote, bare și elemente individuale.' },
      { icon: 'eye', title: 'Potrivire nuanță', text: 'Ajustăm culoarea pentru un finisaj uniform.' },
      { icon: 'droplets', title: 'Aplicare lac', text: 'Finisaj lucios sau mat, durabil în timp.' },
      { icon: 'badge-check', title: 'Finisare finală', text: 'Lustruire și control al calității.' },
      { icon: 'car', title: 'Pregătire suprafață', text: 'Curățare, șlefuire și grunduire corectă.' },
    ],
    faq: [
      {
        question: 'Pot să vopsesc doar o parte a mașinii?',
        answer:
          'Da, executăm lucrări de vopsire pe zone sau integrală, în funcție de starea caroseriei.',
      },
      {
        question: 'Culoarea va fi identică?',
        answer:
          'Potrivim nuanța pentru un finisaj uniform cu restul caroseriei, folosind codul de culoare al mașinii.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, te rugăm să te programezi pentru evaluare și planificarea lucrării.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Prețul depinde de suprafață, materialele folosite și gradul de pregătire necesar.',
      },
    ],
    gallery: VOPSITORIE_GALLERY,
    cta: {
      title: 'Vrei un finisaj impecabil?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Vopsitorie',
    seo: {
      title: 'Vopsitorie Auto Galați | MST Service',
      description:
        'Vopsitorie auto profesională în Galați: vopsire completă sau pe zone, potrivire nuanță. Programează-te la MST Service.',
    },
  },
  {
    slug: 'geometrie-roti',
    title: 'Geometrie Roți',
    icon: 'compass',
    short: 'Reglaj direcție și geometrie roți pentru condus precis.',
    heroImage: '/images/alignment-01.svg',
    heroImageAlt: 'Geometrie roți MST SERVICE Galați',
    heroSubtitle:
      'Reglăm geometria roților și direcția pentru stabilitate, siguranță și uzură uniformă a anvelopelor.',
    intro: {
      what: [
        'Geometria roților presupune măsurarea și corectarea unghiurilor de direcție conform specificațiilor producătorului. Un reglaj corect înseamnă stabilitate la volan, frânare uniformă și anvelope care se uzează normal.',
        'Folosim aparatură digitală pentru măsurători precise și verificăm componentele suspensiei înainte de reglaj, ca să nu corectăm doar efectul, ci și cauza.',
      ],
      when: [
        'Când mașina trage într-o parte în timpul mersului.',
        'După înlocuirea pieselor de direcție sau suspensie.',
        'Când observi uzură neuniformă a anvelopelor.',
      ],
      problems: [
        'Direcție trasă într-o parte sau volan rotit.',
        'Uzură neuniformă și prematură a anvelopelor.',
        'Stabilitate redusă la frânare sau în viraje.',
      ],
    },
    includes: [
      { icon: 'compass', title: 'Măsurare unghiuri', text: 'Citire digitală a unghiurilor de direcție.' },
      { icon: 'rotate-ccw', title: 'Reglaj direcție', text: 'Corectăm unghiurile conform specificațiilor.' },
      { icon: 'circle-dot', title: 'Echilibrare roți', text: 'Distribuim corect masa roții pentru mers stabil.' },
      { icon: 'gauge', title: 'Verificare suspensie', text: 'Identificăm jocuri sau componente uzate.' },
      { icon: 'scan', title: 'Raport geometrie', text: 'Valori înainte și după reglaj, pe înțelesul tău.' },
      { icon: 'wrench', title: 'Corectare deviere', text: 'Eliminăm trasul într-o parte și volanul rotit.' },
    ],
    faq: [
      {
        question: 'Când trebuie verificată geometria roților?',
        answer:
          'După înlocuirea pieselor de direcție, la uzură neuniformă a anvelopelor sau când mașina trage într-o parte.',
      },
      {
        question: 'Cât durează reglajul?',
        answer:
          'Durata depinde de starea componentelor. Îți oferim o estimare după măsurătorile inițiale.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, programarea ne ajută să te preluăm fără timpi de așteptare.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Prețul se stabilește în funcție de reglajele necesare și de componentele verificate.',
      },
    ],
    gallery: GEOMETRIE_GALLERY,
    cta: {
      title: 'Mașina trage într-o parte?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Geometrie roți / Direcție',
    seo: {
      title: 'Geometrie Roți Galați | MST Service',
      description:
        'Reglaj direcție și geometrie roți în Galați. Măsurători digitale și corecții precise. Programează-te la MST Service.',
    },
  },
  {
    slug: 'vulcanizare',
    title: 'Vulcanizare',
    icon: 'circle-dot',
    short: 'Montaj, echilibrare și reparații anvelope.',
    heroImage: '/images/tire-01.svg',
    heroImageAlt: 'Vulcanizare auto MST SERVICE Galați',
    heroSubtitle:
      'Montaj, echilibrare și reparații anvelope, pentru o siguranță maximă la drum în orice sezon.',
    intro: {
      what: [
        'Serviciul de vulcanizare acoperă montarea și demontarea anvelopelor, echilibrarea roților și repararea perforațiilor. Verificăm și presiunea, starea profilului și compatibilitatea anvelopelor cu mașina ta.',
        'O echilibrare corectă reduce vibrațiile la volan și uzura neuniformă, iar o anvelopă bine întreținută contribuie la frânare și stabilitate.',
      ],
      when: [
        'La schimbarea sezonieră a anvelopelor.',
        'Când anvelopele sunt uzate, deteriorate sau pierd presiune.',
        'Când simți vibrații la volan la viteze mai mari.',
      ],
      problems: [
        'Anvelope uzate sau deteriorate.',
        'Pierdere de presiune și perforații.',
        'Dezechilibru la volan și uzură neuniformă.',
      ],
    },
    includes: [
      { icon: 'circle-dot', title: 'Montaj anvelope', text: 'Montare și demontare pentru toate dimensiunile.' },
      { icon: 'rotate-ccw', title: 'Echilibrare roți', text: 'Vibrații reduse la viteze mari.' },
      { icon: 'wrench', title: 'Reparații anvelope', text: 'Remedierea perforațiilor în siguranță.' },
      { icon: 'eye', title: 'Verificare presiune', text: 'Verificăm presiunea și starea anvelopelor.' },
      { icon: 'cog', title: 'Schimb sezonier', text: 'Anvelope de vară și iarnă, montate corect.' },
      { icon: 'shield', title: 'Siguranță la drum', text: 'Recomandări pentru anvelope potrivite mașinii tale.' },
    ],
    faq: [
      {
        question: 'Când trebuie schimbate anvelopele?',
        answer:
          'Atunci când profilul este uzat, anvelopele sunt deteriorate sau la schimbarea sezonului.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, programarea este recomandată, mai ales în perioadele aglomerate de schimb sezonier.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Prețul depinde de lucrările necesare: montaj, echilibrare sau reparații anvelope.',
      },
      {
        question: 'Pot veni cu anvelopele mele?',
        answer:
          'Da, poți veni cu anvelopele tale; echipa noastră le poate monta și echilibra.',
      },
    ],
    gallery: VULCANIZARE_GALLERY,
    cta: {
      title: 'Ai nevoie de anvelope sigure?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Vulcanizare & Anvelope',
    seo: {
      title: 'Vulcanizare Galați | MST Service',
      description:
        'Vulcanizare auto în Galați: montaj anvelope, echilibrare și reparații. Programează-te la MST Service.',
    },
  },
  {
    slug: 'daune-rca',
    title: 'Daune RCA',
    icon: 'shield',
    short: 'Reparații auto după accidente, pe baza poliței RCA.',
    heroImage: '/images/bodywork-02.svg',
    heroImageAlt: 'Reparații daune RCA MST SERVICE Galați',
    heroSubtitle:
      'Reparații complete după accident, cu suport pentru dosarul RCA, de la evaluare până la predare.',
    intro: {
      what: [
        'Serviciul de daune RCA acoperă reparațiile complete ale autovehiculelor implicate în accidente. Ne ocupăm de constatare, evaluare, tinichigerie, vopsitorie și lucrări mecanice, astfel încât mașina să revină la starea inițială.',
        'Te ghidăm prin pașii necesari pentru dosarul RCA și păstrăm legătura cu tine pe tot parcursul reparației.',
      ],
      when: [
        'După un accident sau o coliziune, indiferent de amploare.',
        'Când caroseria, geometria sau elementele mecanice au fost afectate.',
        'Când ai nevoie de suport pentru documentația RCA.',
      ],
      problems: [
        'Caroserie avariată și elemente deformate.',
        'Geometrie afectată în urma impactului.',
        'Elemente care necesită înlocuire sau refacere integrală.',
      ],
    },
    includes: [
      { icon: 'shield', title: 'Evaluare daune', text: 'Constatăm și documentăm reparațiile necesare.' },
      { icon: 'car', title: 'Reparații caroserie', text: 'Îndreptare, panouri și elemente avariate.' },
      { icon: 'paintbrush', title: 'Vopsitorie', text: 'Refacem finisajul zonei reparate.' },
      { icon: 'compass', title: 'Geometrie caroserie', text: 'Verificăm aliniamentele după impact.' },
      { icon: 'scan', title: 'Diagnosticare', text: 'Identificăm și reparațiile ascunse.' },
      { icon: 'badge-check', title: 'Suport RCA', text: 'Te asistăm pe tot parcursul dosarului.' },
    ],
    faq: [
      {
        question: 'Mă ajutați cu dosarul RCA?',
        answer:
          'Da, te ghidăm prin pașii necesari pentru constatare, documentație și reparație.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, programează-te pentru evaluarea daunei și planificarea reparației.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Reparația este stabilită pe baza evaluării daunei și a documentației RCA aferente.',
      },
      {
        question: 'Ce mașini reparați în sistem RCA?',
        answer:
          'Autoturismele implicate în accidente, în funcție de polița RCA și de amploarea daunei.',
      },
    ],
    gallery: DAUNE_RCA_GALLERY,
    cta: {
      title: 'Ai fost implicat într-un accident?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Daune RCA & Accidente',
    seo: {
      title: 'Daune RCA Galați | MST Service',
      description:
        'Reparații auto după accident în Galați, cu suport pentru dosarul RCA. Programează-te la MST Service.',
    },
  },
  {
    slug: 'reparatii-auto',
    title: 'Reparații & Întreținere Auto',
    icon: 'cog',
    short: 'Revizii, întreținere și reparații complete.',
    heroImage: '/images/mechanic-02.svg',
    heroImageAlt: 'Reparații și întreținere auto MST SERVICE Galați',
    heroSubtitle:
      'Întreținere și reparații complete pentru autoturismul tău, într-un singur loc și cu lucrări bine organizate.',
    intro: {
      what: [
        'Serviciul de reparații și întreținere auto acoperă reviziile periodice, schimbul de ulei și filtre, verificarea frânelor, suspensiei și a sistemelor electrice. Toate lucrările sunt realizate cu materiale potrivite pentru mașina ta.',
        'După fiecare intervenție, verificăm mașina înainte de predare, ca să te asiguri că pleci de la noi în siguranță.',
      ],
      when: [
        'La intervalele de revizie recomandate de producător.',
        'Când apar semne de uzură, zgomote sau martori de bord.',
        'Înainte de un drum lung sau de schimbarea sezonului.',
      ],
      problems: [
        'Uzura generală a componentelor.',
        'Fluide și filtre vechi sau nepotrivite.',
        'Componente care necesită inspecție sau înlocuire.',
      ],
    },
    includes: [
      { icon: 'droplets', title: 'Schimb ulei și filtre', text: 'Revizie completă cu materiale potrivite.' },
      { icon: 'wrench', title: 'Revizie generală', text: 'Verificăm sistemele și componentele principale.' },
      { icon: 'battery', title: 'Baterii și electric', text: 'Testare baterie și circuit de încărcare.' },
      { icon: 'disc', title: 'Frâne', text: 'Plăcuțe, discuri și lichid de frână.' },
      { icon: 'gauge', title: 'Suspensie și direcție', text: 'Verificare și înlocuire componente uzate.' },
      { icon: 'badge-check', title: 'Inspecție finală', text: 'Control complet înainte de predare.' },
    ],
    faq: [
      {
        question: 'Când fac revizia mașinii?',
        answer:
          'La intervalele recomandate de producător sau atunci când apar semne de uzură și martori de bord.',
      },
      {
        question: 'Trebuie să fac programare?',
        answer:
          'Da, te rugăm să te programezi pentru o planificare corectă a lucrărilor.',
      },
      {
        question: 'Cum se stabilește prețul?',
        answer:
          'Prețul depinde de lucrările și materialele necesare, stabilite după verificarea mașinii.',
      },
      {
        question: 'Ce include revizia?',
        answer:
          'Include verificarea sistemelor principale, schimbul de ulei și filtre, plus inspecția finală.',
      },
    ],
    gallery: REPARATII_GALLERY,
    cta: {
      title: 'Ai nevoie de o verificare completă?',
      subtitle: 'Programează-ți mașina la MST Service.',
      buttonLabel: 'Programează-te',
    },
    appointmentServiceName: 'Revizie completă / Schimb ulei',
    seo: {
      title: 'Reparații & Întreținere Auto Galați | MST Service',
      description:
        'Reparații și întreținere auto complete în Galați: revizii, frâne, suspensie. Programează-te la MST Service.',
    },
  },
];

export function getServicePage(slug: string): ServicePageData | undefined {
  return SERVICE_PAGES.find((service) => service.slug === slug);
}
