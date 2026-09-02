'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarClock,
  Car,
  Check,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  ArrowLeft,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ChevronDown,
  User,
  Phone,
  Clock,
  ArrowUpDown,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import AppointmentDatePicker from '@/components/admin/AppointmentDatePicker';
import { ADMIN_REPAIR_STATUS_CATALOG } from '@/lib/repair-orders/admin-statuses';
import type { AppointmentState } from '@/lib/repair-orders/types';

type Appointment = {
  id: string;
  service: string;
  carModel: string;
  carYear: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  notes?: string;
  status: AppointmentState;
  createdAt: string;
  proposedDate?: string;
  proposedTime?: string;
  proposalMessage?: string;
};

const ADMIN_TIME_SLOTS = [
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '13:00',
  '14:00',
  '15:00',
  '15:45',
];

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('toate');
  const [sortBy, setSortBy] = useState<'data' | 'createdAt'>('data');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [proposalForId, setProposalForId] = useState<string | null>(null);
  const [proposalDate, setProposalDate] = useState('');
  const [proposalTime, setProposalTime] = useState('09:30');
  const [proposalMessage, setProposalMessage] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
      } else {
        console.error('Actualizarea statusului a eșuat:', data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sigur dorești să ștergi această programare din baza de date?')) return;
    try {
      const res = await fetch(`/api/appointments?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmAppointment = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'confirm' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                ...a,
                status: 'confirmata',
                proposedDate: undefined,
                proposedTime: undefined,
                proposalMessage: undefined,
              }
              : a
          )
        );
      } else {
        console.error('Confirmarea programării a eșuat:', data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const openProposal = (item: Appointment) => {
    setProposalForId(item.id);
    setProposalDate(item.date);
    setProposalTime(item.time);
    setProposalMessage('');
  };

  const handleProposeReschedule = async (id: string) => {
    if (!proposalDate || !proposalTime) return;

    setSavingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          action: 'propose',
          proposedDate: proposalDate,
          proposedTime: proposalTime,
          proposalMessage: proposalMessage.trim(),
        }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                ...a,
                status: 'reprogramare',
                proposedDate: proposalDate,
                proposedTime: proposalTime,
                proposalMessage: proposalMessage.trim(),
              }
              : a
          )
        );
        setProposalForId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'cancel' }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'anulata' } : a))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search) ||
      a.carModel.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'toate' || a.status === statusFilter;
    const matchesDate = dateFilter === '' || a.date === dateFilter;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const sorted = [...filtered].sort((a, b) => {
    let result = 0;
    if (sortBy === 'data') {
      // Compară data programării și apoi ora.
      const dateA = `${a.date} ${a.time}`;
      const dateB = `${b.date} ${b.time}`;
      result = dateA.localeCompare(dateB);
    } else {
      // createdAt recent
      result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return sortDir === 'asc' ? result : -result;
  });

  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'noua':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Cerere Nouă
          </span>
        );
      case 'primita':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.2)]">
            <Car className="h-3.5 w-3.5" />
            Mașină primită
          </span>
        );
      case 'diagnostic':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
            <Search className="h-3.5 w-3.5" />
            Diagnosticare
          </span>
        );
      case 'deviz_pregatit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Sparkles className="h-3.5 w-3.5" />
            Deviz pregătit
          </span>
        );
      case 'deviz_aprobat':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Deviz aprobat
          </span>
        );
      case 'in_lucru':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Reparație în lucru
          </span>
        );
      case 'testare':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-400 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Testare finală
          </span>
        );
      case 'gata':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <Check className="h-3.5 w-3.5" />
            Gata de ridicare
          </span>
        );
      case 'anulata':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
            <XCircle className="h-3.5 w-3.5" />
            Anulată
          </span>
        );
      // ---- Statusuri vechi/legate: nu apar în selector, dar pot fi citite ----
      case 'aprobata':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Aprobată
          </span>
        );
      case 'confirmata':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Confirmată
          </span>
        );
      case 'reprogramare':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
            <CalendarClock className="h-3.5 w-3.5" />
            Reprogramare propusă
          </span>
        );
      case 'finalizata':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Finalizată
          </span>
        );
    }
  };

  const countByStatus = (status: string) => {
    if (status === 'toate') return appointments.length;
    return appointments.filter((a) => a.status === status).length;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#D50000] selection:text-white">
      {/* Background Ambient Glows */}
      <div
        className="pointer-events-none absolute left-1/4 top-10 h-[400px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.12),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 top-1/3 h-[350px] w-[450px] rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.08),transparent_65%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Navigation Top Bar */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-400 backdrop-blur-md transition-all hover:border-[#FF1A1A]/50 hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-[#FF1A1A]" />
              <span>Înapoi la site-ul principal</span>
            </Link>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Panou Programări{' '}
              <span className="bg-gradient-to-r from-[#FF1A1A] via-[#ff4d4d] to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,26,26,0.4)]">
                MST SERVICE
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 -ml-4" />
              Baza de date este sincronizată în timp real
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAppointments}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900/80 px-4 py-2.5 text-xs font-bold text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all hover:border-[#FF1A1A]/50 hover:bg-neutral-800 hover:shadow-[0_0_15px_rgba(255,26,26,0.25)]"
            >
              <RefreshCw className={`h-4 w-4 text-[#FF1A1A] ${loading ? 'animate-spin' : ''}`} />
              Reîmprospătează
            </button>
          </div>
        </div>

        {/* 4 KPI Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* Total */}
          <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Total Programări
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors group-hover:border-[#FF1A1A]/40 group-hover:text-[#FF1A1A]">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-white">{appointments.length}</p>
            <div className="mt-2 text-[11px] text-neutral-500">Toate cererile înregistrate</div>
          </div>

          {/* Noi */}
          <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-amber-500/40 hover:bg-amber-500/[0.08] shadow-[0_4px_20px_rgba(245,158,11,0.08)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Cereri Noi
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-amber-400">
              {countByStatus('noua')}
            </p>
            <div className="mt-2 text-[11px] text-amber-400/70">Necesită contactare & confirmare</div>
          </div>

          {/* În lucru */}
          <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/[0.08] shadow-[0_4px_20px_rgba(249,115,22,0.08)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                În lucru
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-orange-400">
              {countByStatus('in_lucru')}
            </p>
            <div className="mt-2 text-[11px] text-orange-400/70">Reparații în desfășurare</div>
          </div>

          {/* Gata de ridicare */}
          <div className="group relative overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/[0.08] shadow-[0_4px_20px_rgba(59,130,246,0.08)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Gata de ridicare
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-blue-400">
              {countByStatus('gata')}
            </p>
            <div className="mt-2 text-[11px] text-blue-400/70">Mașini pregătite pentru predare</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
          {/* Search Field */}
          <div className="relative flex-1 max-w-lg">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Caută după nume, telefon, mașină, serviciu sau ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors focus:border-[#FF1A1A] focus:ring-1 focus:ring-[#FF1A1A]"
            />
          </div>

          {/* Date Filter */}
          <div className="relative z-10">
            <AppointmentDatePicker
              value={dateFilter}
              onChange={setDateFilter}
              appointments={appointments}
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'data' | 'createdAt')}
                aria-label="Sortează după"
                className="appearance-none rounded-xl border border-neutral-800 bg-neutral-950/80 pl-8 pr-8 py-2.5 text-xs font-bold text-white outline-none transition-colors focus:border-[#FF1A1A] cursor-pointer"
              >
                <option value="data">Data programării</option>
                <option value="createdAt">Data înregistrării</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            </div>

            <button
              onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2.5 text-xs font-bold text-neutral-300 transition-all hover:border-neutral-700 hover:text-white"
              title={sortDir === 'asc' ? 'Crescător' : 'Descrescător'}
            >
              {sortDir === 'asc' ? (
                <>
                  <ArrowUpDown className="h-3.5 w-3.5" /> Crescător
                </>
              ) : (
                <>
                  <ArrowUpDown className="h-3.5 w-3.5 rotate-180" /> Descrescător
                </>
              )}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'toate', label: 'Toate' },
              { id: 'noua', label: 'Noi' },
              { id: 'primita', label: 'Primite' },
              { id: 'diagnostic', label: 'Diagnosticare' },
              { id: 'deviz_pregatit', label: 'Deviz pregătit' },
              { id: 'deviz_aprobat', label: 'Deviz aprobat' },
              { id: 'in_lucru', label: 'În lucru' },
              { id: 'testare', label: 'Testare' },
              { id: 'gata', label: 'Gata' },
              { id: 'anulata', label: 'Anulate' },
            ].map((tab) => {
              const active = statusFilter === tab.id;
              const count = countByStatus(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${active
                    ? 'border-[#FF1A1A] bg-gradient-to-r from-[#D50000] to-[#FF1A1A] text-white shadow-[0_0_18px_rgba(213,0,0,0.45)]'
                    : 'border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${active ? 'bg-black/30 text-white' : 'bg-white/10 text-neutral-400'
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          /* Custom Premium Loading Spinner */
          <div className="flex flex-col items-center justify-center py-28 rounded-2xl border border-neutral-800 bg-neutral-900/30 backdrop-blur-md">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#FF1A1A]/20" />
              <div className="absolute inset-0 rounded-full border-2 border-[#FF1A1A] border-t-transparent animate-spin" />
              <Sparkles className="h-5 w-5 text-[#FF1A1A]" />
            </div>
            <p className="mt-4 text-sm font-semibold text-neutral-300">Se încarcă programările...</p>
            <span className="text-xs text-neutral-500 mt-1">Conectare la baza de date locală</span>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 py-20 text-center backdrop-blur-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-white/[0.02] text-neutral-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Nicio programare găsită</h3>
            <p className="mt-1 max-w-sm mx-auto text-xs text-neutral-400">
              {search || statusFilter !== 'toate'
                ? 'Nu există programări care să corespundă criteriilor de căutare alese.'
                : 'Când un client trimite o cerere prin site, va fi afișată automat aici.'}
            </p>
          </div>
        ) : (
          /* List of Luxury Appointment Cards */
          <div className="space-y-4">
            {filtered.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleString('ro-RO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const waMessage = encodeURIComponent(
                `Bună ziua ${item.name}! Vă contactăm de la MST Service Galați referitor la programarea dvs. (${item.service} - ${item.carModel}) pentru data de ${item.date}, ora ${item.time}.`
              );
              const waUrl = `https://wa.me/40${item.phone.replace(/[^0-9]/g, '').replace(/^0/, '')}?text=${waMessage}`;

              return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-900/80 shadow-[0_4px_25px_rgba(0,0,0,0.5)]"
                >
                  {/* Card Header Row */}
                  <div className="flex flex-col gap-3 border-b border-neutral-800/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs font-black tracking-wider text-[#FF1A1A]">
                        #{item.id.slice(-6).toUpperCase()}
                      </span>
                      {getStatusBadge(item.status)}
                      <span className="text-[11px] text-neutral-500">
                        Înregistrat: {formattedDate}
                      </span>
                    </div>

                    {/* Status Select & Delete */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as Appointment['status'])
                          }
                          disabled={savingId === item.id}
                          aria-label="Schimbă statusul programării"
                          className="appearance-none rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-1.5 pr-8 text-xs font-bold text-white outline-none transition-colors focus:border-[#FF1A1A] cursor-pointer disabled:cursor-wait disabled:opacity-50"
                        >
                          {ADMIN_REPAIR_STATUS_CATALOG.map((s) => (
                            <option key={s.id} value={s.id}>
                              Status: {s.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                        title="Șterge din baza de date"
                        aria-label="Șterge programarea"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Ora propusă deja clientului */}
                  {item.status === 'reprogramare' && item.proposedDate && item.proposedTime && (
                    <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/[0.06] p-3 text-xs text-neutral-300">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-1">
                        Ora propusă clientului:
                      </span>
                      <span className="font-bold text-white">
                        {item.proposedDate} - ora {item.proposedTime}
                      </span>
                      {item.proposalMessage && (
                        <p className="mt-1 text-neutral-300">Mesaj: {item.proposalMessage}</p>
                      )}
                    </div>
                  )}

                  {/* Acțiuni rapide admin */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {item.status === 'noua' || item.status === 'reprogramare' ? (
                      <button
                        onClick={() => handleConfirmAppointment(item.id)}
                        disabled={savingId === item.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-bold text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:cursor-wait disabled:opacity-50"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Confirmă ora actuală
                      </button>
                    ) : null}

                    {item.status !== 'finalizata' && item.status !== 'anulata' && (
                      <button
                        onClick={() => openProposal(item)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-[11px] font-bold text-orange-400 transition-all hover:bg-orange-500/20"
                      >
                        <CalendarClock className="h-3.5 w-3.5" />
                        Propune reprogramare
                      </button>
                    )}

                    {item.status !== 'anulata' && item.status !== 'finalizata' && (
                      <button
                        onClick={() => handleCancelAppointment(item.id)}
                        disabled={savingId === item.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-400 transition-all hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Anulează
                      </button>
                    )}
                  </div>

                  {/* Formular propunere reprogramare */}
                  {proposalForId === item.id && (
                    <div className="mt-3 rounded-xl border border-orange-500/30 bg-orange-500/[0.06] p-4">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            Data propusă
                          </label>
                          <input
                            type="date"
                            value={proposalDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setProposalDate(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-semibold text-white outline-none transition-colors focus:border-orange-400 [color-scheme:dark]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            Ora propusă
                          </label>
                          <select
                            value={proposalTime}
                            onChange={(e) => setProposalTime(e.target.value)}
                            className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-semibold text-white outline-none transition-colors focus:border-orange-400"
                          >
                            {ADMIN_TIME_SLOTS.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            Mesaj pentru client (opțional)
                          </label>
                          <input
                            type="text"
                            value={proposalMessage}
                            onChange={(e) => setProposalMessage(e.target.value)}
                            placeholder="ex: Ora aleasă nu mai este disponibilă."
                            className="mt-1.5 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors focus:border-orange-400"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleProposeReschedule(item.id)}
                          disabled={savingId === item.id}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-[11px] font-bold text-black transition-all hover:bg-orange-400 disabled:cursor-wait disabled:opacity-50"
                        >
                          <CalendarClock className="h-3.5 w-3.5" />
                          Trimite reprogramarea
                        </button>
                        <button
                          onClick={() => setProposalForId(null)}
                          className="rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-[11px] font-bold text-neutral-400 transition-colors hover:text-white"
                        >
                          Renunță
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3 Columns Details */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {/* Client Info */}
                    <div className="flex items-start gap-3 rounded-xl border border-neutral-800/60 bg-neutral-950/40 p-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-300">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                          Client
                        </span>
                        <p className="truncate text-sm font-bold text-white">{item.name}</p>

                        <div className="mt-1 flex items-center gap-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#FF1A1A] hover:underline"
                            title="Sună clientul"
                          >
                            <Phone className="h-3 w-3" />
                            {item.phone}
                          </a>

                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-md bg-[#25D366]/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-[#25D366]/20"
                            title="Deschide chat WhatsApp"
                          >
                            <MessageSquare className="h-2.5 w-2.5" />
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Service & Car */}
                    <div className="flex items-start gap-3 rounded-xl border border-neutral-800/60 bg-neutral-950/40 p-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-300">
                        <Car className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                          Serviciu & Autovehicul
                        </span>
                        <p className="truncate text-sm font-bold text-white">{item.service}</p>
                        <p className="truncate text-xs text-neutral-400 mt-0.5">
                          {item.carModel} {item.carYear ? `(${item.carYear})` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-start gap-3 rounded-xl border border-neutral-800/60 bg-neutral-950/40 p-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-neutral-300">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                          Dată & Interval Orar
                        </span>
                        <p className="text-sm font-bold text-white">{item.date}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-300 mt-0.5">
                          <Clock className="h-3 w-3 text-[#FF1A1A]" />
                          Ora {item.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Details */}
                  {item.notes && (
                    <div className="mt-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3 text-xs text-neutral-300">
                      <span className="font-bold text-neutral-400 uppercase tracking-wider text-[10px] block mb-1">
                        Observații / Descriere Problemă:
                      </span>
                      {item.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
