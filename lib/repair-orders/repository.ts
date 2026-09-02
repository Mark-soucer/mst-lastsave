import { getAppointments, type AppointmentRecord } from '@/lib/db';
import { MOCK_REPAIR_ORDERS } from './mock-data';
import { REPAIR_STATUS_CATALOG } from './statuses';
import type { RepairOrder, RepairStatus, RepairStatusId } from './types';

/**
 * Mapare între statusurile granulare alese din Panoul Admin și statusurile
 * canonice afișate pe pagina publică de tracking (/status/[cod]).
 *
 * Statusurile admin (snake_case, ex: in_lucru) sunt traduse în statusurile
 * canonice (kebab-case, ex: reparatie-in-lucru) din `REPAIR_STATUS_CATALOG`.
 */
const ADMIN_TO_REPAIR_STATUS_MAP: Record<string, RepairStatusId> = {
  noua: 'programata',
  primita: 'masina-primita',
  diagnostic: 'diagnosticare',
  deviz_pregatit: 'deviz-pregatit',
  deviz_aprobat: 'deviz-aprobat',
  in_lucru: 'reparatie-in-lucru',
  testare: 'testare-finala',
  gata: 'gata-de-ridicare',
};

const LEGACY_TO_REPAIR_STATUS_MAP: Record<string, RepairStatusId> = {
  // Statusuri vechi din fluxul de programare, păstrate pentru compatibilitate.
  confirmata: 'programata',
  aprobata: 'programata',
  reprogramare: 'programata',
};

/**
 * Repository pentru comenzile de reparație.
 *
 * Citește din două surse locale:
 * 1. Comenzile demo (mock) pentru exemplul 1048 / ABC123.
 * 2. Programările online existente, salvate de sistemul de programări.
 *
 * Când va exista o bază de date reală, implementarea internă poate fi
 * înlocuită cu interogări SQL / ORM, fără a modifica componentele de UI.
 */

function getShortCode(id: string): string {
  return id.slice(-6).toUpperCase();
}

/**
 * Normalizează codul introdus de client:
 * - elimină spațiile de la început/sfârșit,
 * - elimină simbolul '#' folosit în afișare (ex: "#R-E2CY" -> "R-E2CY"),
 * - ignoră literele mari/mici ("r-e2cy" -> "R-E2CY").
 */
function normalizeCode(value: string): string {
  return value
    .trim()
    // Elimină '#' folosit în afișare (ex: "#R-E2CY" -> "R-E2CY") dar și
    // varianta URL-encoded '%23' (ex: "%23L-WFT0" -> "L-WFT0"), pe care
    // Next.js o poate livra neschimbată în parametrul rutei.
    .replace(/^(?:#+|%23)+/i, '')
    .toUpperCase();
}

/**
 * Normalizează un id de status pentru comparații robuste, indiferent de forma
 * sub care a fost salvat în baza de date:
 *   - ignoră literele mari/mici,
 *   - elimină diacriticele românești (ț -> t, ă -> a, ș -> s, î/â -> i/a),
 *   - tratează identic separatoarele: '-', '_' sau spațiu.
 * Exemple echivalente: 'masina_primita' == 'Masina-Primită' == 'masina-primita'.
 */
function normalizeStatusId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    // Elimină semnele diacritice rezultate în urma decompoziției NFD (ă, ț, ș, î...).
    .replace(/[\u0300-\u036f]/g, '')
    // Unifică separatoarele ('-', '_', spațiu) într-o singură liniuță...
    .replace(/[\s_-]+/g, '-')
    // ...și scapă de eventualele separatoare rămase la margini (ex: 'deviz_pregătit_ ').
    .replace(/^[\s_-]+|[\s_-]+$/g, '');
}

/**
 * Mapare pe formă normalizată a statusurilor admin (snake_case) către cele
 * canonice (kebab-case). Acceptă atât cheile standard din Panoul Admin
 * (ex: 'in_lucru'), cât și variante de scriere ('in-lucru', 'IN LUCRU').
 * 'noua' și 'anulata' sunt tratate separat mai jos, pentru texte dedicate.
 */
const NORMALIZED_ADMIN_TO_REPAIR_STATUS_MAP: Record<string, RepairStatusId> =
  Object.entries(ADMIN_TO_REPAIR_STATUS_MAP).reduce<Record<string, RepairStatusId>>(
    (acc, [adminId, canonicalId]) => {
      acc[normalizeStatusId(adminId)] = canonicalId;
      return acc;
    },
    {}
  );

function parseVehicle(carModel: string): { brand: string; model: string } {
  const normalized = carModel.trim();

  if (!normalized || normalized.toLowerCase() === 'nespecificat') {
    return { brand: 'Autoturism', model: 'Nespecificat' };
  }

  const [brand, ...modelParts] = normalized.split(/\s+/);
  const model = modelParts.length > 0 ? modelParts.join(' ') : brand;

  return { brand, model };
}

function buildStatusesForAppointment(
  currentStatus: RepairStatusId,
  statusOverrides: StatusOverrides = {},
  options: { markAllCompleted?: boolean; highlightCurrent?: boolean } = {}
): RepairStatus[] {
  const currentIndex = REPAIR_STATUS_CATALOG.findIndex((item) => item.id === currentStatus);
  const { markAllCompleted = false, highlightCurrent = true } = options;

  return REPAIR_STATUS_CATALOG.map((definition, index) => {
    const override = statusOverrides[definition.id];

    // Etapele evidențiate SE CALCULEAZĂ STRICT după poziția în catalog:
    //  - pașii anteriori indicelui curent -> completed (check verde),
    //  - pasul de pe indicele curent      -> current (activ, „în lucru"),
    //  - pașii viitori                    -> inactive, fără highlight.
    // Un pas NU POATE fi niciodată simultan completed ȘI current
    // (ex: o comandă finalizată marchează totul parcurse, fără pas activ).
    const completed = markAllCompleted ? true : index < currentIndex;
    const current = !markAllCompleted && highlightCurrent && definition.id === currentStatus;

    return {
      id: definition.id,
      title: override?.title ?? definition.title,
      description: override?.description ?? definition.description,
      completed,
      current,
    };
  });
}

type StatusOverrides = Partial<
  Record<RepairStatusId, { title?: string; description?: string }>
>;

type StatusResolution = {
  /** Statusul canonic (din REPAIR_STATUS_CATALOG) care reprezintă progresul curent. */
  currentStatus: RepairStatusId;
  overrides: StatusOverrides;
  /** Când este true, TOATE etapele sunt marcate parcurse și niciuna nu e „în lucru". */
  markAllCompleted?: boolean;
  /** Când este false, niciun pas nu primește evidențierea „în lucru" (ex: anulată). */
  highlightCurrent?: boolean;
};

/**
 * Traduce statusul unei programări (status ales din Panoul Admin sau un status
 * vechiu) în statusul canonic afișat pe pagina publică de tracking, împreună
 * cu eventualele texte personalizate pentru prim/ultimul pas.
 *
 * Comparația se face pe formă „normalizată" a statusului (fără diacritice,
 * fără majuscule, separatoarele '-', '_' sau spațiu tratate identic), astfel
 * încât orice variantă scrisă în baza de date (ex: 'deviz_pregătit',
 * 'masina_primita', 'reparatie-in-lucru', 'gata_de_ridicare') se mapează exact
 * la etapa canonică din catalog - niciodată la „toate etapele parcurse".
 */
function appointmentStatusToRepairStatus(
  appointment: AppointmentRecord
): StatusResolution {
  const status = appointment.status;
  const normalized = normalizeStatusId(status);
  const serviceDesc = `Serviciu: ${appointment.service}.`;

  // ---- Statusuri vechi (fluxul de programare) cu texte dedicate -------------
  if (normalized === 'noua') {
    return {
      currentStatus: 'programata',
      overrides: {
        programata: {
          title: 'Programare înregistrată',
          description: `${serviceDesc} Programarea a fost înregistrată și urmează să fie confirmată de echipa MST Service.`,
        },
      },
    };
  }

  if (normalized === 'anulata') {
    return {
      currentStatus: 'programata',
      // O programare anulată nu prezintă niciun pas activ („în lucru").
      highlightCurrent: false,
      overrides: {
        programata: {
          title: 'Programare anulată',
          description: `${serviceDesc} Programarea a fost anulată. Contactează-ne pentru reprogramare.`,
        },
      },
    };
  }

  if (normalized === 'reprogramare') {
    return {
      currentStatus: 'programata',
      overrides: {
        programata: {
          title: 'Reprogramare propusă',
          description:
            appointment.proposedDate && appointment.proposedTime
              ? `${serviceDesc} Am propus data ${appointment.proposedDate}, ora ${appointment.proposedTime}. Confirmă din această pagină dacă îți convine.`
              : `${serviceDesc} Echipa MST Service ți-a propus o nouă oră pentru programare.`,
        },
      },
    };
  }

  if (normalized === 'confirmata') {
    return {
      currentStatus: 'programata',
      overrides: {
        programata: {
          title: 'Programare confirmată',
          description: `${serviceDesc} Data ${appointment.date}, ora ${appointment.time}. Te așteptăm la service!`,
        },
      },
    };
  }

  if (normalized === 'aprobata') {
    return {
      currentStatus: 'programata',
      overrides: {
        programata: {
          title: 'Programare aprobată',
          description: `${serviceDesc} Programarea a fost aprobată de echipa MST Service.`,
        },
      },
    };
  }

  // ---- Comandă finalizată: toate etapele parcurse, fără pas activ ------------
  if (normalized === 'finalizata') {
    return {
      currentStatus: 'finalizata',
      markAllCompleted: true,
      overrides: {
        finalizata: {
          description: `${serviceDesc} Lucrarea a fost finalizată.`,
        },
      },
    };
  }

  // ---- Statusuri granulare (Panoul Admin, snake_case) -> status canonic ------
  // Forma normalizată a cheii acoperă și variantele de scriere din baza de date
  // (ex: 'in_lucru', 'in-lucru', 'IN LUCRU', 'deviz pregătit').
  const adminMapped = NORMALIZED_ADMIN_TO_REPAIR_STATUS_MAP[normalized];
  if (adminMapped) {
    return { currentStatus: adminMapped, overrides: {} };
  }

  // ---- Statusuri deja canonice sau variante (ex: 'gata_de_ridicare') ---------
  const canonical = REPAIR_STATUS_CATALOG.find(
    (item) => normalizeStatusId(item.id) === normalized
  );
  if (canonical) {
    return { currentStatus: canonical.id, overrides: {} };
  }

  // ---- Fallback sigur: status necunoscut -> pornește de la început. ---------
  const legacyFallback = LEGACY_TO_REPAIR_STATUS_MAP[normalized];
  return {
    currentStatus: legacyFallback ?? 'programata',
    overrides: {},
  };
}

function appointmentToRepairOrder(appointment: AppointmentRecord): RepairOrder {
  const shortCode = getShortCode(appointment.id);
  const vehicle = parseVehicle(appointment.carModel);
  const { currentStatus, overrides, markAllCompleted, highlightCurrent } =
    appointmentStatusToRepairStatus(appointment);
  const lastUpdatedAt = appointment.updatedAt || appointment.createdAt;

  const statuses = buildStatusesForAppointment(currentStatus, overrides, {
    markAllCompleted,
    highlightCurrent,
  }).map((status) =>
    status.id === currentStatus ? { ...status, timestamp: lastUpdatedAt } : status
  );
  return {
    id: appointment.id,
    orderNumber: shortCode,
    accessCode: shortCode,
    customerName: appointment.name,
    vehicle: {
      brand: vehicle.brand,
      model: vehicle.model,
      licensePlate: '',
    },
    currentStatus,
    statuses,
    createdAt: appointment.createdAt,
    updatedAt: lastUpdatedAt,
    appointment: {
      id: appointment.id,
      status: appointment.status,
      service: appointment.service,
      name: appointment.name,
      phone: appointment.phone,
      date: appointment.date,
      time: appointment.time,
      proposedDate: appointment.proposedDate,
      proposedTime: appointment.proposedTime,
      proposalMessage: appointment.proposalMessage,
    },
  };
}

export async function getRepairOrder(idOrCode: string): Promise<RepairOrder | null> {
  // 1. Normalizează inputul căutat: eliminăm '#', spațiile și literele mari/mici.
  const lookup = normalizeCode(idOrCode);
  if (!lookup) return null;

  // 2. Caută întâi în comenzile demo (ex: 1048 / ABC123), dacă există.
  const mockOrder = MOCK_REPAIR_ORDERS.find((candidate) => {
    return (
      normalizeCode(candidate.id) === lookup ||
      normalizeCode(candidate.orderNumber) === lookup ||
      normalizeCode(candidate.accessCode) === lookup
    );
  });

  if (mockOrder) {
    return {
      ...mockOrder,
      statuses: mockOrder.statuses.map((status) => ({
        ...status,
        current: status.id === mockOrder.currentStatus,
      })),
    };
  }

  // 3. Citește lista reală de programări din data/appointments.json.
  const appointments = await getAppointments();

  // 4. Potrivește codul scurt (ultimele 6 caractere din ID, ex: "mst-...-wft0" -> "L-WFT0")
  //    sau ID-ul complet, ambele normalizate (fără '#', fără spații, uppercase).
  const appointment = appointments.find((candidate) => {
    const shortCode = normalizeCode(candidate.id.slice(-6));
    const fullId = normalizeCode(candidate.id);
    return shortCode === lookup || fullId === lookup;
  });

  if (!appointment) return null;

  // 5. Mapează programarea găsită într-o comandă de reparație pentru pagina de status.
  return appointmentToRepairOrder(appointment);
}

