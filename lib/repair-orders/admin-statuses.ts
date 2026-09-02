import type { AdminRepairStatusId } from './types';

export type AdminRepairStatusDefinition = {
  id: AdminRepairStatusId;
  /** Numele descriptiv afișat în dropdown-ul din Panoul Admin. */
  label: string;
  /** Descriere scurtă afișată pentru clarificare în UI. */
  description: string;
};

/**
 * Catalogul central al statusurilor granulare de reparație.
 *
 * Selectorul din Panoul Admin și pagina de tracking a clientului folosesc
 * ACEEAȘI listă, astfel încât orice status ales de admin este reflectat 1:1
 * pe pagina clientului (/status/[cod]).
 *
 * Ordinea din array = ordinea în care apar în dropdown (cronologia reparației).
 */
export const ADMIN_REPAIR_STATUS_CATALOG: AdminRepairStatusDefinition[] = [
  {
    id: 'noua',
    label: 'Programare înregistrată',
    description: 'Programarea a fost înregistrată în sistem.',
  },
  {
    id: 'primita',
    label: 'Mașină primită',
    description: 'Autovehiculul a fost preluat în service.',
  },
  {
    id: 'diagnostic',
    label: 'Diagnosticare',
    description: 'Au fost verificate sistemele și componentele principale.',
  },
  {
    id: 'deviz_pregatit',
    label: 'Deviz pregătit',
    description: 'Devizul de reparație a fost întocmit.',
  },
  {
    id: 'deviz_aprobat',
    label: 'Deviz aprobat',
    description: 'Devizul de reparație a fost aprobat.',
  },
  {
    id: 'in_lucru',
    label: 'Reparație în lucru',
    description: 'Lucrările de reparație sunt în desfășurare.',
  },
  {
    id: 'testare',
    label: 'Testare finală',
    description: 'Se verifică lucrările executate înainte de predare.',
  },
  {
    id: 'gata',
    label: 'Gata de ridicare',
    description: 'Mașina este pregătită pentru predare.',
  },
  {
    id: 'anulata',
    label: 'Anulată',
    description: 'Programarea a fost anulată.',
  },
];

/** Caută biblioteca de statusuri după id (util în componente / badge-uri). */
export function getAdminRepairStatusDefinition(
  id: string
): AdminRepairStatusDefinition | undefined {
  return ADMIN_REPAIR_STATUS_CATALOG.find((item) => item.id === id);
}