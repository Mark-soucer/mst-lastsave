export const REPAIR_STATUS_IDS = [
  'programata',
  'masina-primita',
  'diagnosticare',
  'deviz-pregatit',
  'deviz-aprobat',
  'reparatie-in-lucru',
  'testare-finala',
  'gata-de-ridicare',
  'finalizata',
] as const;

export type RepairStatusId = (typeof REPAIR_STATUS_IDS)[number];

// ---------------------------------------------------------------------------
// Statusuri granulare de reparație (snake_case) folosite în Panoul Admin.
// Acestea sunt exact statusurile care apar pe pagina de tracking a clientului,
// sub numele lor descriptive (ex: primita -> "Mașină primită", in_lucru ->
// "Reparație în lucru").
// ---------------------------------------------------------------------------
export const ADMIN_REPAIR_STATUS_IDS = [
  'noua',
  'primita',
  'diagnostic',
  'deviz_pregatit',
  'deviz_aprobat',
  'in_lucru',
  'testare',
  'gata',
  'anulata',
] as const;

export type AdminRepairStatusId = (typeof ADMIN_REPAIR_STATUS_IDS)[number];

/**
 * Statusuri „legacy" rămase din vechiul flux de programare (aprobare /
 * confirmare / reprogramare). Le păstrăm în tipul `AppointmentState` pentru a
 * putea citi și afișa programările vechi existente în data/appointments.json,
 * dar NICIODATĂ nu apar în selectorul granular din admin.
 */
export const LEGACY_APPOINTMENT_STATUS_IDS = [
  'aprobata',
  'confirmata',
  'reprogramare',
  'finalizata',
] as const;

export const APPOINTMENT_STATUSES = [
  ...ADMIN_REPAIR_STATUS_IDS,
  ...LEGACY_APPOINTMENT_STATUS_IDS,
] as const;

export type AppointmentState = (typeof APPOINTMENT_STATUSES)[number];

export type AppointmentPublicInfo = {
  id: string;
  status: AppointmentState;
  service: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  proposedDate?: string;
  proposedTime?: string;
  proposalMessage?: string;
  /** Marca mașinii (coloana `car_make`). Valoare sigură — vine ca string
   *  ne-gol ('Necunoscut' când coloana e NULL în bază). */
  carMake?: string;
  /** Descrierea problemei (coloana `problem_description`). Valoare sigură —
   *  vine ca string ('' când coloana e NULL în bază). */
  problemDescription?: string;
};

export type RepairStatus = {
  id: RepairStatusId;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  /** Data la care a avut loc tranziția. Poate lipsi pentru etapele viitoare. */
  timestamp?: string;
};

export type RepairVehicle = {
  brand: string;
  model: string;
  licensePlate: string;
};

export type RepairOrder = {
  id: string;
  orderNumber: string;
  /** Codul public din link, ex: /status/ABC123. */
  accessCode: string;
  /** Păstrat în model pentru viitorul dashboard admin, NU este afișat clientului. */
  customerName: string;
  vehicle: RepairVehicle;
  currentStatus: RepairStatusId;
  statuses: RepairStatus[];
  createdAt: string;
  updatedAt: string;
  /** Detalii publice când comanda provine dintr-o programare online. */
  appointment?: AppointmentPublicInfo;
};
