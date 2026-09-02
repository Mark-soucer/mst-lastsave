'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

type Appointment = {
  id: string;
  date: string; // format YYYY-MM-DD
};

type AppointmentDatePickerProps = {
  value: string;
  onChange: (date: string) => void;
  appointments: Appointment[];
};

const MONTHS_RO = [
  'Ianuarie',
  'Februarie',
  'Martie',
  'Aprilie',
  'Mai',
  'Iunie',
  'Iulie',
  'August',
  'Septembrie',
  'Octombrie',
  'Noiembrie',
  'Decembrie',
];

const WEEKDAYS_RO = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

export default function AppointmentDatePicker({
  value,
  onChange,
  appointments,
}: AppointmentDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    return value
      ? new Date(value).getFullYear()
      : new Date().getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    return value ? new Date(value).getMonth() : new Date().getMonth();
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number } | null>(null);

  // Set de date (YYYY-MM-DD) care au cel puțin o programare.
  const datesWithAppointments = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((a) => {
      if (a.date) set.add(a.date);
    });
    return set;
  }, [appointments]);

  // Închide calendarul la click în afara componentei.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  // Construiește grila calendarului (luni → duminică).
  const cells = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // JS: getDay() returnează 0 = Duminică. Convertim la 0 = Luni.
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const result: (Date | null)[] = [];

    // Zile din luna anterioară.
    for (let i = firstWeekday - 1; i >= 0; i--) {
      result.push(new Date(viewYear, viewMonth - 1, daysInPrevMonth - i));
    }
    // Zile din luna curentă.
    for (let d = 1; d <= daysInMonth; d++) {
      result.push(new Date(viewYear, viewMonth, d));
    }
    // Zile din luna următoare, până completăm 42 de celule (6 săptămâni).
    const remaining = (7 - (result.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      result.push(new Date(viewYear, viewMonth + 1, d));
    }

    return result;
  }, [viewYear, viewMonth]);

  const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDate = (d: Date) => {
    onChange(toKey(d));
    setOpen(false);
  };

  const formatDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return `${d} ${MONTHS_RO[m - 1]} ${y}`;
  };

  // Calculează poziția dropdown-ului (pentru portal) față de buton.
  const computeDropdownPosition = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
    });
  };

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(computeDropdownPosition);
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950/80 px-3 py-2.5 text-xs font-bold text-white outline-none transition-colors focus:border-[#FF1A1A] cursor-pointer hover:border-neutral-700"
      >
        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
        <span className={value ? 'text-white' : 'text-neutral-500'}>
          {value ? formatDisplay(value) : 'Toate datele'}
        </span>
        <ChevronLeft className="h-3.5 w-3.5 text-neutral-500 rotate-[-90deg]" />
      </button>

      {/* Dropdown */}
      {open &&
        dropdownStyle &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] w-[280px] rounded-2xl border border-neutral-800 bg-neutral-950 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
            style={{ top: dropdownStyle.top, left: dropdownStyle.left }}
          >
            {/* Header navigare */}
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={goPrevMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
                aria-label="Luna anterioară"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                {MONTHS_RO[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={goNextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 transition-colors hover:border-neutral-700 hover:text-white"
                aria-label="Luna următoare"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Zilele săptămânii */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS_RO.map((w) => (
                <span
                  key={w}
                  className="text-center text-[10px] font-bold uppercase text-neutral-500"
                >
                  {w}
                </span>
              ))}
            </div>

            {/* Grila zilelor */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />;
                const key = toKey(d);
                const isCurrentMonth = d.getMonth() === viewMonth;
                const isSelected = value === key;
                const isToday = todayKey === key;
                const hasAppointments = datesWithAppointments.has(key);

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => selectDate(d)}
                    className={`relative flex h-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${isSelected
                      ? 'bg-gradient-to-br from-[#D50000] to-[#FF1A1A] text-white shadow-[0_0_12px_rgba(255,26,26,0.5)]'
                      : 'text-neutral-300 hover:bg-white/10'
                      } ${!isCurrentMonth ? 'opacity-30' : ''} ${isToday && !isSelected ? 'ring-1 ring-neutral-600' : ''
                      }`}
                  >
                    {d.getDate()}
                    {/* Bulină roșie pentru zilele cu programări */}
                    {hasAppointments && (
                      <span
                        className={`absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected
                          ? 'bg-white'
                          : 'bg-[#FF1A1A] shadow-[0_0_6px_rgba(255,26,26,0.9)]'
                          }`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legendă și buton ștergere */}
            <div className="mt-2 flex items-center justify-between border-t border-neutral-800 pt-2">
              <span className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF1A1A]" /> programări existente
              </span>
              {value && (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setOpen(false);
                  }}
                  className="flex items-center gap-1 text-[10px] font-bold text-neutral-400 transition-colors hover:text-[#FF1A1A]"
                >
                  <XCircle className="h-3 w-3" />
                  Șterge filtru
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

