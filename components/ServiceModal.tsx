'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import { useAppointment } from '@/context/AppointmentContext';
import type { Service } from '@/lib/services';

type ServiceModalProps = {
  service: Service | null;
  onClose: () => void;
};

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  const { openAppointment } = useAppointment();

  useEffect(() => {
    if (!service) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [service, onClose]);

  const handleBookNow = () => {
    const serviceName = service?.title || 'Mecanică auto';
    onClose();
    setTimeout(() => {
      openAppointment(serviceName);
    }, 150);
  };

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          aria-labelledby="service-modal-title"
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111111] shadow-2xl"
          >
            <div className="h-1 w-full bg-gradient-to-r from-[#D50000] via-[#FF1A1A] to-transparent" aria-hidden="true" />

            <button
              onClick={onClose}
              aria-label="Închide"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A0A0A0] transition-all hover:border-[#FF1A1A]/50 hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="p-6 sm:p-10">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#D50000]/20 text-[#FF1A1A] ring-1 ring-white/10">
                <service.icon size={32} aria-hidden="true" />
              </div>
              <h3 id="service-modal-title" className="font-display text-3xl font-bold text-white sm:text-4xl">
                {service.title}
              </h3>
              <p className="mt-4 leading-relaxed text-[#A0A0A0]">{service.description}</p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF1A1A]">
                    Probleme rezolvate
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {(service.problems ?? []).map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF1A1A]" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF1A1A]">
                    Ce include
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {(service.includes ?? []).map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-[#A0A0A0]">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF1A1A]" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10">
                <Button onClick={handleBookNow} className="w-full">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  Programează o intervenție online
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}