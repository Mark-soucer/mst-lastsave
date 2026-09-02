import type { RepairStatusId } from './types';

export type RepairStatusDefinition = {
  id: RepairStatusId;
  title: string;
  description: string;
};

/**
 * Catalogul central de statusuri disponibile pentru o comandă de reparație.
 * Dashboard-ul admin va putea folosi același catalog, fără a-l mai defini în UI.
 */
export const REPAIR_STATUS_CATALOG: RepairStatusDefinition[] = [
  {
    id: 'programata',
    title: 'Programată',
    description: 'Comanda a fost înregistrată în sistem.',
  },
  {
    id: 'masina-primita',
    title: 'Mașină primită',
    description: 'Autovehiculul a fost preluat în service.',
  },
  {
    id: 'diagnosticare',
    title: 'Diagnosticare',
    description: 'Au fost verificate sistemele și componentele principale.',
  },
  {
    id: 'deviz-pregatit',
    title: 'Deviz pregătit',
    description: 'Devizul de reparație a fost întocmit.',
  },
  {
    id: 'deviz-aprobat',
    title: 'Deviz aprobat',
    description: 'Devizul de reparație a fost aprobat.',
  },
  {
    id: 'reparatie-in-lucru',
    title: 'Reparație în lucru',
    description: 'Lucrările de reparație sunt în desfășurare.',
  },
  {
    id: 'testare-finala',
    title: 'Testare finală',
    description: 'Se vor verifica lucrările executate.',
  },
  {
    id: 'gata-de-ridicare',
    title: 'Gata de ridicare',
    description: 'Mașina este pregătită pentru predare.',
  },
  {
    id: 'finalizata',
    title: 'Finalizată',
    description: 'Lucrarea a fost finalizată.',
  },
];
