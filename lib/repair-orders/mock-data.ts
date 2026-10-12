import type { RepairOrder } from './types';

/**
 * Date demo locale pentru sistemul de status.
 * Aceste date simulează comenzile existente și vor fi înlocuite cu un repository
 * real bazat pe bază de date, fără a modifica componentele de UI.
 */
export const MOCK_REPAIR_ORDERS: RepairOrder[] = [
  {
    id: '1048',
    orderNumber: '1048',
    accessCode: 'ABC123',
    customerName: 'Ion Popescu',
    vehicle: {
      brand: 'Ford',
      model: 'Focus',
      licensePlate: 'GL 01 MST',
    },
    currentStatus: 'reparatie-in-lucru',
    statuses: [
      {
        id: 'programata',
        title: 'Programată',
        description: 'Comanda a fost înregistrată în sistem.',
        completed: true,
        current: false,
        timestamp: '2026-08-26T09:00:00+03:00',
      },
      {
        id: 'masina-primita',
        title: 'Mașină primită',
        description: 'Autovehiculul a fost preluat în service.',
        completed: true,
        current: false,
        timestamp: '2026-08-26T10:15:00+03:00',
      },
      {
        id: 'diagnosticare',
        title: 'Diagnosticare',
        description: 'Au fost verificate sistemele și componentele principale.',
        completed: true,
        current: false,
        timestamp: '2026-08-26T11:30:00+03:00',
      },
      {
        id: 'deviz-pregatit',
        title: 'Deviz pregătit',
        description: 'Devizul de reparație a fost întocmit.',
        completed: true,
        current: false,
        timestamp: '2026-08-26T15:00:00+03:00',
      },
      {
        id: 'deviz-aprobat',
        title: 'Deviz aprobat',
        description: 'Devizul de reparație a fost aprobat.',
        completed: true,
        current: false,
        timestamp: '2026-08-27T09:20:00+03:00',
      },
      {
        id: 'reparatie-in-lucru',
        title: 'Reparație în lucru',
        description: 'Înlocuire kit distribuție',
        completed: false,
        current: true,
        timestamp: '2026-08-29T14:35:00+03:00',
      },
      {
        id: 'testare-finala',
        title: 'Testare finală',
        description: 'Se vor verifica lucrările executate.',
        completed: false,
        current: false,
      },
      {
        id: 'gata-de-ridicare',
        title: 'Gata de ridicare',
        description: 'Mașina este pregătită pentru predare.',
        completed: false,
        current: false,
      },
      {
        id: 'finalizata',
        title: 'Finalizată',
        description: 'Lucrarea a fost finalizată.',
        completed: false,
        current: false,
      },
    ],
    createdAt: '2026-08-26T09:00:00+03:00',
    updatedAt: '2026-08-29T14:35:00+03:00',
  },
];
