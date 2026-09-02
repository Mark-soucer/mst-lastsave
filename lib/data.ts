import {
  Wrench,
  Car,
  Paintbrush,
  Compass,
  CircleDot,
  ShieldAlert,
  ScanSearch,
  Cog,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

export const BUSINESS = {
  name: 'MST SERVICE',
  tagline: 'Performanță. Precizie. Încredere.',
  phone: '0757 240 854',
  phoneHref: 'tel:+40757240854',
  email: 'contact@mstservice.ro',
  address: {
    street: 'Strada Vasile Alecsandri Nr. 1',
    zip: '807326',
    city: 'Galați',
    country: 'România',
    full: 'Strada Vasile Alecsandri Nr. 1, 807326 Galați, România',
  },
  schedule: [
    { day: 'Luni – Vineri', hours: '08:00 – 16:30' },
    { day: 'Sâmbătă', hours: 'Închis' },
    { day: 'Duminică', hours: 'Închis' },
  ],
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('MST SERVICE Strada Vasile Alecsandri Nr. 1 807326 Galați România'),
};

export const NAV_LINKS = [
  { label: 'Acasă', href: '#acasa' },
  { label: 'Servicii', href: '#servicii' },
  { label: 'Despre noi', href: '#despre' },
  { label: 'Galerie', href: '#lucrari' },
  { label: 'Contact', href: '#contact' },
];

export const SERVICES = [
  {
    id: 'mecanica-auto',
    icon: Wrench,
    title: 'Mecanică auto',
    short: 'Diagnosticare, întreținere și reparații mecanice complete.',
    intro:
      'De la revizii și schimburi de ulei, până la reparații complexe ale motorului și transmisiei.',
    includes: [
      'Revizii și întreținere periodică',
      'Diagnosticare electronică',
      'Reparații motor și transmisie',
      'Sistem frânare și suspensie',
      'Schimb consumabile și filtre',
    ],
  },
  {
    id: 'tinichigerie-auto',
    icon: Car,
    title: 'Tinichigerie auto',
    short: 'Remodelare caroserie și reparații table, cu rezultate impecabile.',
    intro:
      'Redăm forma originală a caroseriei, corectând loviturile, adânciturile și deformările tablei.',
    includes: [
      'Reparații lovituri și adâncituri',
      'Corectare elemente caroserie',
      'Înlocuire panouri și elemente',
      'Pregătire suprafață pentru vopsire',
      'Aliniere geometrie caroserie',
    ],
  },
  {
    id: 'vopsitorie-auto',
    icon: Paintbrush,
    title: 'Vopsitorie auto',
    short: 'Vopsire completă sau parțială, cu finisaje profesionale.',
    intro:
      'Realizăm lucrări de vopsitorie auto cu materiale de calitate, asigurând un finisaj uniform și durabil.',
    includes: [
      'Vopsire completă și parțială',
      'Cârăire și reparare zgârieturi',
      'Aplicare lac și finisaj lucios/mat',
      'Pregătire profesională a suprafeței',
      'Potrivire nuanțe și tonifiere',
    ],
  },
  {
    id: 'reglaj-directie',
    icon: Compass,
    title: 'Reglaj direcție',
    short: 'Geometrie roți și reglaj direcție pentru condus precis.',
    intro:
      'Reglăm geometria roților și direcția pentru o uzură uniformă a anvelopelor și un comportament sigur.',
    includes: [
      'Măsurare unghiuri roți',
      'Reglaj unghiuri direcție',
      'Verificare echilibrare roți',
      'Corectare deviere volan',
      'Raport diagnosticare complet',
    ],
  },
  {
    id: 'vulcanizare',
    icon: CircleDot,
    title: 'Vulcanizare',
    short: 'Montare, echilibrare și reparații anvelope.',
    intro:
      'Servicii complete de vulcanizare pentru anvelope, inclusiv montarea și echilibrarea roților.',
    includes: [
      'Montare și demontare anvelope',
      'Echilibrare roți',
      'Reparații perforații',
      'Verificare presiune și uzură',
      'Schimb sezonier',
    ],
  },
  {
    id: 'daune-rca',
    icon: ShieldAlert,
    title: 'Daune RCA',
    short: 'Reparații auto după accidente, pe baza poliței RCA.',
    intro:
      'Efectuăm reparații complete ale autovehiculelor implicate în accidente, conform daunelor RCA.',
    includes: [
      'Constatare și evaluare daune',
      'Documentație RCA',
      'Reparații caroserie',
      'Vopsitorie și finisaje',
      'Asistență pe tot parcursul',
    ],
  },
  {
    id: 'diagnosticare-auto',
    icon: ScanSearch,
    title: 'Diagnosticare auto',
    short: 'Diagnosticare electronică rapidă și precisă.',
    intro:
      'Identificăm rapid defecțiunile prin diagnosticare electronică avansată, înainte de intervenție.',
    includes: [
      'Scanare module electronice',
      'Citire și ștergere erori',
      'Testare senzori și actuatoare',
      'Verificare sisteme electrice',
      'Raport detaliat al defecțiunilor',
    ],
  },
  {
    id: 'reparatii-auto',
    icon: Cog,
    title: 'Reparații auto',
    short: 'Reparații și întreținere completă pentru orice autovehicul.',
    intro:
      'Reparații și întreținere auto pentru toate tipurile de autovehicule, efectuate cu precizie.',
    includes: [
      'Întreținere periodică',
      'Schimb ulei și filtre',
      'Baterii și sisteme electrice',
      'Frâne și componente suspensie',
      'Inspecții tehnice periodice',
    ],
  },
];

export const WHY_ITEMS = [
  {
    title: 'Servicii auto complete',
    text: 'Toate lucrările necesare, într-un singur loc.',
  },
  {
    title: 'Echipamente moderne',
    text: 'Utilaje și scule actualizate pentru rezultate precise.',
  },
  {
    title: 'Atenție la detalii',
    text: 'Fiecare intervenție este tratată cu grijă și rigoare.',
  },
  {
    title: 'Profesionalism',
    text: 'Lucrări executate corect, cu materiale de calitate.',
  },
  {
    title: 'Un singur loc, multiple lucrări',
    text: 'Mecanică, caroserie, vopsitorie, geometrie, vulcanizare.',
  },
  {
    title: 'Locație în Galați',
    text: 'Acces facil, pe Strada Vasile Alecsandri Nr. 1.',
  },
];

export const WORKFLOW_STEPS = [
  { step: '01', title: 'Programare', text: 'Ne contactezi și stabilim o programare.' },
  { step: '02', title: 'Inspecție', text: 'Verificăm vizual și discutăm despre problemă.' },
  { step: '03', title: 'Diagnosticare', text: 'Identificăm cauza prin diagnosticare completă.' },
  { step: '04', title: 'Reparație', text: 'Efectuăm lucrarea conform standardelor.' },
  { step: '05', title: 'Verificare finală', text: 'Testăm și confirmăm funcționarea corectă.' },
  { step: '06', title: 'Livrare', text: 'Îți predăm mașina gata de drum.' },
];

export const GALLERY_IMAGES = [
  { src: '/images/mechanic-01.svg', alt: 'Mecanică auto MST SERVICE', category: 'Mecanică' },
  { src: '/images/mechanic-02.svg', alt: 'Diagnosticare auto MST SERVICE', category: 'Mecanică' },
  { src: '/images/bodywork-01.svg', alt: 'Tinichigerie auto MST SERVICE', category: 'Tinichigerie' },
  { src: '/images/bodywork-02.svg', alt: 'Reparații caroserie MST SERVICE', category: 'Tinichigerie' },
  { src: '/images/paint-01.svg', alt: 'Vopsitorie auto MST SERVICE', category: 'Vopsitorie' },
  { src: '/images/paint-02.svg', alt: 'Finisaje vopsitorie MST SERVICE', category: 'Vopsitorie' },
  { src: '/images/tire-01.svg', alt: 'Vulcanizare MST SERVICE', category: 'Vulcanizare' },
  { src: '/images/alignment-01.svg', alt: 'Geometrie roți MST SERVICE', category: 'Vulcanizare' },
];

export const GALLERY_FILTERS = ['Toate', 'Mecanică', 'Tinichigerie', 'Vopsitorie', 'Vulcanizare'];

export const APPOINTMENT_SERVICES = [
  'Mecanică auto',
  'Tinichigerie auto',
  'Vopsitorie auto',
  'Reglaj direcție / geometrie roți',
  'Vulcanizare',
  'Daune RCA',
  'Diagnosticare auto',
  'Altele',
];

export const CONTACT_ITEMS = [
  { icon: MapPin, label: 'Adresă', value: BUSINESS.address.full, href: BUSINESS.mapsUrl, target: '_blank' },
  { icon: Phone, label: 'Telefon', value: BUSINESS.phone, href: BUSINESS.phoneHref },
  { icon: Mail, label: 'Email', value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
  { icon: Clock, label: 'Program', value: 'Luni – Vineri, 08:00 – 16:30' },
];
