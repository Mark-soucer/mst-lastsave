'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  Car,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Hash,
  Loader2,
  MessageCircle,
  Phone,
  Wrench,
} from 'lucide-react';
import { BUSINESS } from '@/lib/data';
import type { RepairOrder, RepairStatus } from '@/lib/repair-orders/types';

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Bucharest',
  });
};

const formatProposedDateTime = (date: string, time?: string) => {
  const datePart = new Date(`${date}T${time || '12:00'}`).toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Bucharest',
  });

  return time ? `${datePart}, ora ${time}` : datePart;
};

type InfoItemProps = {
  icon: typeof Car;
  label: string;
  value: string;
  accent?: boolean;
};

function InfoItem({ icon: Icon, label, value, accent = false }: InfoItemProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${accent
          ? 'bg-[#FF1A1A]/15 text-[#FF1A1A] ring-[#FF1A1A]/30'
          : 'bg-white/5 text-[#A0A0A0] ring-white/10'
          }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
          {label}
        </p>
        <p className="mt-1 truncate text-base font-bold text-white md:text-lg">{value}</p>
      </div>
    </div>
  );
}

type TimelineItemProps = {
  status: RepairStatus;
  isLast: boolean;
};

function TimelineItem({ status, isLast }: TimelineItemProps) {
  const iconWrapper = status.completed
    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
    : status.current
      ? 'border-[#FF1A1A]/60 bg-[#FF1A1A]/15 text-[#FF1A1A] shadow-[0_0_20px_rgba(255,26,26,0.35)]'
      : 'border-white/10 bg-white/[0.03] text-[#555]';

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex gap-4 pb-9 last:pb-0"
    >
      {!isLast && (
        <span
          className="absolute left-[15px] top-8 h-full w-px bg-gradient-to-b from-white/15 to-white/5"
          aria-hidden="true"
        />
      )}

      <span
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${iconWrapper}`}
      >
        {status.completed ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : status.current ? (
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#FF1A1A] opacity-60" />
            <span className="h-2 w-2 rounded-full bg-[#FF1A1A]" />
          </span>
        ) : (
          <Circle className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-center gap-2">
          <h3
            className={`text-base font-semibold ${status.current ? 'text-[#FF1A1A]' : status.completed ? 'text-white' : 'text-[#777]'
              }`}
          >
            {status.title}
          </h3>
          {status.current && (
            <span className="rounded-full border border-[#FF1A1A]/40 bg-[#FF1A1A]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF1A1A]">
              În lucru
            </span>
          )}
        </div>

        <p
          className={`mt-1 text-sm leading-relaxed ${status.current ? 'text-[#B0B0B0]' : 'text-[#777]'
            }`}
        >
          {status.description}
        </p>

        {status.timestamp && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#666]">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDateTime(status.timestamp)}
          </p>
        )}
      </div>
    </motion.li>
  );
}

type StatusPageProps = {
  order: RepairOrder;
};

export default function StatusPage({ order }: StatusPageProps) {
  const currentStatus =
    order.statuses.find((status) => status.id === order.currentStatus) ??
    order.statuses.find((status) => status.current) ??
    order.statuses[0];

  const updatedAt = order.updatedAt ? formatDateTime(order.updatedAt) : null;
  const appointment = order.appointment;

  const [confirming, setConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirmProposal = async () => {
    if (!appointment) return;

    setConfirming(true);
    setConfirmError('');

    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appointment.id, action: 'confirm-client' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmed(true);
      } else {
        setConfirmError(data.message || 'Nu s-a putut confirma programarea.');
      }
    } catch (err) {
      setConfirmError('Eroare de conexiune. Încearcă din nou.');
    } finally {
      setConfirming(false);
    }
  };

  const whatsAppMessage = encodeURIComponent(
    `Bună ziua! Am o întrebare despre comanda #${order.orderNumber} (${order.vehicle.brand} ${order.vehicle.model}).`
  );
  const whatsAppUrl = `https://wa.me/40757240854?text=${whatsAppMessage}`;

  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-[#080808] pt-28 pb-24 md:pt-32">
      <div
        className="pointer-events-none absolute -left-32 top-24 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.12),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.09),transparent_60%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 md:px-8">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <Image
            src="/images/logo-mst-transparent.png"
            alt="MST SERVICE"
            width={200}
            height={70}
            priority
            className="h-12 w-auto object-contain drop-shadow-[0_10px_30px_rgba(255,26,26,0.35)] md:h-16"
          />
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#A0A0A0] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.9)]" />
            Status comandă
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl">
            Statusul mașinii tale
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#A0A0A0] md:text-base">
            Urmărește aici, în timp real, progresul lucrărilor efectuate de echipa MST Service.
          </p>
        </motion.div>

        {/* INFORMAȚII PRINCIPALE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          <InfoItem icon={Car} label="Marca" value={order.vehicle.brand} />
          <InfoItem icon={Wrench} label="Model" value={order.vehicle.model} />
          <InfoItem icon={Hash} label="Număr comandă" value={`#${order.orderNumber}`} accent />
        </motion.section>

        {/* STATUS ACTUAL */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-6 overflow-hidden rounded-3xl border border-[#FF1A1A]/30 bg-gradient-to-br from-[#D50000]/15 via-white/[0.04] to-transparent p-6 shadow-[0_20px_70px_-25px_rgba(213,0,0,0.45)] md:p-8"
        >
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.22),transparent_65%)] blur-2xl"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#FF1A1A]">
              Status actual
            </span>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-white md:text-3xl">
              {currentStatus?.title}
            </h2>
            {currentStatus?.description && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#B0B0B0] md:text-base">
                {currentStatus.description}
              </p>
            )}

            {updatedAt && (
              <p className="mt-5 flex items-center gap-2 text-xs text-[#888] md:text-sm">
                <Clock className="h-4 w-4 text-[#FF1A1A]" aria-hidden="true" />
                Ultima actualizare: <span className="font-semibold text-white">{updatedAt}</span>
              </p>
            )}
          </div>
        </motion.section>

        {/* CONFIRMARE REPROGRAMARE PROGRAMARE ONLINE */}
        {appointment?.status === 'reprogramare' && appointment.proposedDate && appointment.proposedTime && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-white/[0.04] to-transparent p-6 shadow-[0_20px_70px_-25px_rgba(245,158,11,0.4)] md:p-8"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
                  <CalendarCheck className="h-6 w-6" aria-hidden="true" />
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-400">
                    Programarea ta necesită confirmare
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-white md:text-2xl">
                    Ți-am propus o nouă oră
                  </h3>

                  {!confirmed ? (
                    <>
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#B0B0B0]">
                        Ora aleasă inițial nu a fost disponibilă. Te rugăm să confirmi noua
                        variantă propusă de echipa MST Service:
                      </p>

                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm font-bold text-white">
                        <CalendarCheck className="mr-2 inline h-4 w-4 text-amber-400" aria-hidden="true" />
                        {formatProposedDateTime(appointment.proposedDate, appointment.proposedTime)}
                      </div>

                      {appointment.proposalMessage && (
                        <p className="mt-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#C0C0C0]">
                          <span className="font-bold text-white">Mesaj de la service: </span>
                          {appointment.proposalMessage}
                        </p>
                      )}

                      {confirmError && (
                        <p className="mt-3 text-sm font-semibold text-red-400">{confirmError}</p>
                      )}

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={handleConfirmProposal}
                          disabled={confirming}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(213,0,0,0.45)] transition-all hover:bg-[#FF1A1A] disabled:cursor-wait disabled:opacity-60"
                        >
                          {confirming ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                              Se confirmă...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" aria-hidden="true" />
                              Confirmă data & ora
                            </>
                          )}
                        </button>

                        <a
                          href={`https://wa.me/40757240854?text=${encodeURIComponent(
                            `Bună ziua! Am o programare la MST Service (#${order.orderNumber}) și nu pot confirma ora propusă. Mă puteți ajuta, vă rog?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-[#25D366]/10 px-6 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-[#25D366]/20"
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          Nu pot la acea oră
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-bold text-white">
                          Programarea a fost confirmată cu succes!
                        </p>
                        <p className="mt-1 text-sm text-emerald-200/80">
                          Te așteptăm la service pe{' '}
                          {formatProposedDateTime(appointment.proposedDate, appointment.proposedTime)}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* TIMELINE */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:p-8"
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-gradient-to-r from-transparent to-[#FF1A1A]" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A0A0A0]">
              Progresul reparației
            </span>
          </div>

          <ol className="mt-8">
            {order.statuses.map((status, index) => (
              <TimelineItem
                key={status.id}
                status={status}
                isLast={index === order.statuses.length - 1}
              />
            ))}
          </ol>
        </motion.section>

        {/* CONTACT */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur md:p-8"
        >
          <h2 className="text-xl font-bold text-white md:text-2xl">Ai întrebări?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#A0A0A0]">
            Suntem aici să te ajutăm. Contactează-ne telefonic sau direct pe WhatsApp.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(213,0,0,0.45)] transition-all hover:bg-[#FF1A1A]"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Contactează MST Service
            </a>

            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-[#25D366]/10 px-6 py-3 text-sm font-bold text-emerald-400 transition-all hover:bg-[#25D366]/20"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Scrie-ne pe WhatsApp
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
