'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  Car,
  Wrench,
  CheckCircle2,
  Phone,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { useAppointment } from '@/context/AppointmentContext';
import { BUSINESS } from '@/lib/data';

const AVAILABLE_SERVICES = [
  { id: 'mecanica', name: 'Mecanică auto', icon: Wrench, badge: 'Popular' },
  { id: 'tinichigerie', name: 'Tinichigerie', icon: Car },
  { id: 'vopsitorie', name: 'Vopsitorie', icon: Sparkles },
  { id: 'geometrie', name: 'Geometrie roți / Direcție', icon: Wrench },
  { id: 'vulcanizare', name: 'Vulcanizare & Anvelope', icon: Car },
  { id: 'diagnoza', name: 'Diagnoză computerizată', icon: Wrench, badge: 'Rapid' },
  { id: 'rca', name: 'Daune RCA & Accidente', icon: ShieldCheck },
  { id: 'revizie', name: 'Revizie completă / Schimb ulei', icon: Wrench },
];

const TIME_SLOTS = [
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '13:00',
  '14:00',
  '15:00',
  '15:45',
];

export default function AppointmentModal() {
  const { isOpen, closeAppointment, selectedService } = useAppointment();

  // Form states
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState(selectedService || 'Mecanică auto');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:30');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync selected service when prop updates
  useEffect(() => {
    if (selectedService) {
      setService(selectedService);
    }
  }, [selectedService]);

  // Set default date to tomorrow or next business day
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    // If weekend, advance
    if (tomorrow.getDay() === 0) tomorrow.setDate(tomorrow.getDate() + 1);
    if (tomorrow.getDay() === 6) tomorrow.setDate(tomorrow.getDate() + 2);

    const formatted = tomorrow.toISOString().split('T')[0];
    setDate(formatted);
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
      setAppointmentId(null);
      setErrorMsg(null);
      setStep(1);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle direct Database submission
  const handleSubmitBooking = async (withWhatsApp = false) => {
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Vă rugăm să introduceți numele și numărul de telefon.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service,
          carModel: carModel.trim() || 'Nespecificat',
          carYear: carYear.trim() || '',
          date,
          time,
          name: name.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAppointmentId(data.data.id);
        setSubmitted(true);

        if (withWhatsApp) {
          const message = `*PROGRAMARE NOUĂ (#${data.data.id.slice(-6).toUpperCase()}) - MST SERVICE*
--------------------------------
👤 *Nume:* ${name}
📞 *Telefon:* ${phone}
🚗 *Mașină:* ${carModel || 'Nespecificat'} ${carYear ? `(${carYear})` : ''}
🔧 *Serviciu:* ${service}
📅 *Data:* ${date}
⏰ *Ora:* ${time}
${notes ? `📝 *Observații:* ${notes}` : ''}
--------------------------------
Înregistrată pe mstservice.ro`;

          const encoded = encodeURIComponent(message);
          window.open(`https://wa.me/40757240854?text=${encoded}`, '_blank');
        }
      } else {
        setErrorMsg(data.message || 'A apărut o eroare la salvarea programării.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Eroare de conexiune cu serverul.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneCall = () => {
    window.location.href = 'tel:+40757240854';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAppointment}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0e0e0e] shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(213,0,0,0.2)]"
        >
          {/* Top accent glowing bar */}
          <div className="sticky top-0 z-20 h-1 w-full bg-gradient-to-r from-[#D50000] via-[#FF1A1A] to-[#D50000]" />

          {/* Header */}
          <div className="sticky top-1 z-10 flex items-center justify-between border-b border-white/10 bg-[#0e0e0e]/95 px-6 py-4 backdrop-blur-md">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF1A1A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF1A1A] animate-pulse" />
                Programare Online
              </span>
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Rezervă o intervenție la MST Service
              </h3>
            </div>

            <button
              onClick={closeAppointment}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A0A0A0] transition-colors hover:border-[#FF1A1A]/50 hover:bg-white/10 hover:text-white"
              aria-label="Închide"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8">
            {submitted ? (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF1A1A]/20 text-[#FF1A1A] ring-8 ring-[#FF1A1A]/10 shadow-[0_0_30px_rgba(255,26,26,0.5)]">
                  <CheckCircle2 className="h-9 w-9" />
                </div>

                <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-bold text-[#FF1A1A]">
                  ID: #{appointmentId?.slice(-6).toUpperCase() || 'CONFIRMAT'}
                </span>

                <h4 className="mt-3 text-2xl font-bold text-white">
                  Programarea a fost salvată în sistem!
                </h4>
                <p className="mt-2 max-w-md text-sm text-[#A0A0A0]">
                  Cererea ta pentru{' '}
                  <span className="font-semibold text-white">{service}</span> pe data de{' '}
                  <span className="font-semibold text-white">{date}</span> (ora{' '}
                  <span className="font-semibold text-white">{time}</span>) a fost înregistrată în baza de date. Te vom contacta la numărul{' '}
                  <span className="font-semibold text-white">{phone}</span> pentru confirmare. Poți urmări și confirma programarea din linkul de mai jos.
                </p>

                <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
                  {appointmentId && (
                    <Link
                      href={`/status/${appointmentId.slice(-6).toUpperCase()}`}
                      onClick={closeAppointment}
                      className="flex items-center justify-center gap-2 rounded-full border border-[#FF1A1A]/40 bg-[#FF1A1A]/10 px-6 py-3 text-sm font-bold text-[#FF1A1A] transition-all hover:bg-[#FF1A1A]/20"
                    >
                      <Activity className="h-4 w-4" aria-hidden="true" />
                      Vezi & confirmă programarea
                    </Link>
                  )}

                  <button
                    onClick={closeAppointment}
                    className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:bg-white/90"
                  >
                    Gata, am înțeles
                  </button>
                  <button
                    onClick={handlePhoneCall}
                    className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-[#FF1A1A] hover:bg-white/10"
                  >
                    <Phone className="h-4 w-4 text-[#FF1A1A]" />
                    Sună direct: {BUSINESS.phone}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Multi-step Form */
              <div>
                {/* Steps Indicator */}
                <div className="mb-8 flex items-center justify-between">
                  {[
                    { s: 1, title: 'Serviciu' },
                    { s: 2, title: 'Dată & Oră' },
                    { s: 3, title: 'Contact' },
                  ].map((item, idx) => (
                    <div key={item.s} className="flex flex-1 items-center">
                      <div
                        className={`flex items-center gap-2 ${step >= item.s ? 'text-white' : 'text-[#555]'
                          }`}
                      >
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${step === item.s
                            ? 'bg-[#D50000] text-white shadow-[0_0_12px_rgba(213,0,0,0.6)]'
                            : step > item.s
                              ? 'bg-white/20 text-white'
                              : 'bg-white/5 text-[#666]'
                            }`}
                        >
                          {step > item.s ? '✓' : item.s}
                        </span>
                        <span className="hidden text-xs font-semibold sm:inline">
                          {item.title}
                        </span>
                      </div>
                      {idx < 2 && (
                        <div
                          className={`mx-2 h-0.5 flex-1 transition-all ${step > item.s ? 'bg-[#D50000]' : 'bg-white/10'
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* STEP 1: Select Service & Car details */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                        1. Alege serviciul dorit:
                      </label>
                      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                        {AVAILABLE_SERVICES.map((item) => {
                          const Icon = item.icon;
                          const isSelected = service === item.name;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setService(item.name)}
                              className={`group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${isSelected
                                ? 'border-[#FF1A1A] bg-white/[0.08] shadow-[0_0_20px_rgba(255,26,26,0.25)]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]'
                                }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isSelected
                                  ? 'bg-[#FF1A1A] text-white'
                                  : 'bg-white/5 text-[#A0A0A0] group-hover:text-white'
                                  }`}
                              >
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span
                                  className={`block text-xs font-semibold sm:text-sm ${isSelected ? 'text-white' : 'text-[#ccc]'
                                    }`}
                                >
                                  {item.name}
                                </span>
                              </div>
                              {item.badge && (
                                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold text-[#FF1A1A]">
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                          Marcă & Model Mașină:
                        </label>
                        <input
                          type="text"
                          placeholder="ex: VW Passat, BMW Seria 3, Dacia Duster"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF1A1A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                          An fabricație / Nr. Înmatr. (opțional):
                        </label>
                        <input
                          type="text"
                          placeholder="ex: 2018 / GL 01 ABC"
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF1A1A]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-2 rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(213,0,0,0.5)] transition-all hover:bg-[#FF1A1A]"
                      >
                        Continuă la Dată & Oră
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Date & Time */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                        <Calendar className="h-4 w-4 text-[#FF1A1A]" />
                        Selectează data dorită:
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base font-semibold text-white outline-none transition-colors focus:border-[#FF1A1A] [color-scheme:dark]"
                      />
                      <p className="mt-1.5 text-[11px] text-[#888]">
                        * Program de lucru: Luni – Vineri, 08:00 – 16:30.
                      </p>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                        <Clock className="h-4 w-4 text-[#FF1A1A]" />
                        Alege intervalul orar:
                      </label>
                      <div className="mt-2.5 grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = time === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTime(slot)}
                              className={`rounded-xl border py-2.5 text-xs font-bold transition-all sm:text-sm ${isSelected
                                ? 'border-[#FF1A1A] bg-[#D50000] text-white shadow-[0_0_15px_rgba(213,0,0,0.6)]'
                                : 'border-white/10 bg-white/5 text-[#aaa] hover:border-white/30 hover:text-white'
                                }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#A0A0A0] transition-colors hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Înapoi
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex items-center gap-2 rounded-full bg-[#D50000] px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(213,0,0,0.5)] transition-all hover:bg-[#FF1A1A]"
                      >
                        Continuă la Contact
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Contact Details & Submit */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                        Numele tău complet:
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Ion Popescu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                        Număr de Telefon:
                      </label>
                      <input
                        type="tel"
                        placeholder="ex: 0757 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF1A1A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                        Detalii problemă / Observații (opțional):
                      </label>
                      <textarea
                        rows={2}
                        placeholder="ex: Zgomot la frânare pe puntea față, necesită verificare plăcuțe."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF1A1A]"
                      />
                    </div>

                    {/* Summary badge */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-[#A0A0A0]">
                      <span className="font-bold text-white">Rezumat: </span>
                      {service} • {carModel || 'Mașină'} • {date} ora {time}
                    </div>

                    {errorMsg && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-400">
                        {errorMsg}
                      </div>
                    )}

                    <div className="space-y-2.5 pt-2">
                      {/* Database Direct Submit */}
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSubmitBooking(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D50000] px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_25px_rgba(213,0,0,0.5)] transition-all hover:bg-[#FF1A1A] disabled:opacity-60"
                      >
                        {loading ? (
                          <span>Se procesează...</span>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Trimite Programarea în Sistem
                          </>
                        )}
                      </button>

                      {/* WhatsApp Option */}
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleSubmitBooking(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-[#25D366]/10 px-6 py-3 text-xs font-bold text-emerald-400 transition-all hover:bg-[#25D366]/20"
                      >
                        Trimite și pe WhatsApp (Opțional)
                      </button>
                    </div>

                    <div className="flex justify-start pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#A0A0A0] transition-colors hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Înapoi
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
