'use client';

import { motion } from 'framer-motion';
import { Calendar, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppointment } from '@/context/AppointmentContext';

export default function FloatingBooking() {
  const { openAppointment } = useAppointment();
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
    >
      {/* WhatsApp Quick Link */}
      <a
        href="https://wa.me/40757240854?text=Salut!%20Doresc%20o%20informație%20despre%20serviciile%20MST%20Service."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact WhatsApp"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-[#25D366] text-black shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_4px_25px_rgba(37,211,102,0.6)]"
      >
        <MessageSquare className="h-5 w-5 fill-current" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-white/10 bg-[#0d0d0d] px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
          Scrie pe WhatsApp
        </span>
      </a>

      {/* Main Appointment Trigger */}
      <button
        onClick={() => openAppointment()}
        className="group relative flex items-center gap-2.5 rounded-full border border-white/20 bg-gradient-to-r from-[#D50000] to-[#FF1A1A] px-5 py-3 text-sm font-bold text-white shadow-[0_4px_25px_rgba(213,0,0,0.5)] backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_35px_rgba(255,26,26,0.7)]"
      >
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Programează-te</span>
        <span className="sm:hidden">Programare</span>
        <span className="flex h-2 w-2 rounded-full bg-white animate-ping" />
      </button>
    </motion.div>
  );
}
