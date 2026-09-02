'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ChevronRight, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import { useAppointment } from '@/context/AppointmentContext';

const ThreeHero = lazy(() => import('@/components/three/ThreeHero'));

export default function Hero() {
  const { openAppointment } = useAppointment();
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const yContent = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), { stiffness: 120, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section
      id="acasa"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080808]"
      aria-label="Hero - MST SERVICE"
    >
      {/* 3D background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {!reduced && mounted ? (
          <Suspense fallback={null}>
            <ThreeHero />
          </Suspense>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(213,0,0,0.18),transparent_60%)]" />
        )}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[#080808]/90 via-[#080808]/50 to-[#080808]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_80%_20%,rgba(213,0,0,0.15),transparent_55%)]"
        aria-hidden="true"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
        aria-hidden="true"
      />

      {/* Light streak */}
      <div
        className="absolute left-1/2 top-1/2 z-[1] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,26,26,0.12),transparent_60%)] blur-2xl"
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        style={{ y: yContent, opacity, scale }}
        className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-center overflow-x-hidden px-5 pt-24 pb-16 text-center md:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#A0A0A0] backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.9)]" />
          Service auto premium — Galați
        </motion.p>

        {/* Premium Brand Display with Clean Transparent Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mb-8 flex flex-col items-center"
        >
          {/* Ambient red halo backglow behind the letters */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-44 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,26,26,0.35),transparent_70%)] blur-2xl transition-all duration-700 group-hover:scale-125 group-hover:bg-[radial-gradient(ellipse_at_center,rgba(255,26,26,0.5),transparent_70%)]"
            aria-hidden="true"
          />

          {/* Clean Transparent Logo directly blended into the dark background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-mst-transparent.png"
            alt="MST SERVICE"
            className="relative z-10 h-20 w-auto max-w-full object-contain drop-shadow-[0_10px_35px_rgba(255,26,26,0.4)] transition-transform duration-500 group-hover:scale-[1.03] sm:h-28 md:h-36"
          />
        </motion.div>

        {/* SEO Title */}
        <h1 className="sr-only">MST SERVICE Galați - Service Auto Premium</h1>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-5 text-base font-semibold uppercase tracking-[0.25em] text-white/90 sm:text-lg md:text-xl"
        >
          Performanță. Precizie. Încredere.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.7 }}
          className="mt-5 max-w-2xl text-sm leading-relaxed text-[#A0A0A0] sm:text-base md:text-lg"
        >
          Service auto premium în Galați pentru mecanică, tinichigerie, vopsitorie,
          geometrie și vulcanizare.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
        >
          <Button onClick={() => openAppointment()} size="lg" magnetic>
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Programează-te Online
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
          </Button>
          <Button href="#servicii" variant="outline" size="lg">
            Descoperă serviciile
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#servicii"
        aria-label="Mergi la servicii"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={reduced ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-[#A0A0A0]"
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">Scroll</span>
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </motion.div>
      </motion.a>
    </section>
  );
}

