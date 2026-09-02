'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { BEFORE_AFTER_FILTERS, BEFORE_AFTER_PROJECTS } from '@/lib/projects';

export default function BeforeAfter() {
  const [filter, setFilter] = useState('Toate');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const filtered =
    filter === 'Toate'
      ? BEFORE_AFTER_PROJECTS
      : BEFORE_AFTER_PROJECTS.filter((project) => project.category === filter);

  const activeProject = lightbox !== null ? (filtered[lightbox] ?? null) : null;

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const nextProject = useCallback(() => {
    setLightbox((prev) => (prev === null ? prev : (prev + 1) % filtered.length));
  }, [filtered.length]);

  const prevProject = useCallback(() => {
    setLightbox((prev) =>
      prev === null ? prev : (prev - 1 + filtered.length) % filtered.length,
    );
  }, [filtered.length]);

  useEffect(() => {
    if (lightbox === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowRight') nextProject();
      if (event.key === 'ArrowLeft') prevProject();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeLightbox, lightbox, nextProject, prevProject]);

  const handleCardPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const handleCardPointerUp = (event: ReactPointerEvent<HTMLElement>, index: number) => {
    const start = pointerStart.current;
    pointerStart.current = null;

    if (!start) return;

    const deltaX = Math.abs(event.clientX - start.x);
    const deltaY = Math.abs(event.clientY - start.y);

    // Deschide lightbox-ul doar dacă a fost click, nu drag pe sliderul Before/After.
    if (deltaX <= 6 && deltaY <= 6) {
      setLightbox(index);
    }
  };

  const handleCardPointerCancel = () => {
    pointerStart.current = null;
  };

  return (
    <section
      id="lucrari"
      className="relative overflow-hidden bg-[#0A0A0A] py-24 md:py-32"
      aria-label="Lucrări înainte și după"
    >
      <div
        className="absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.08),transparent_60%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Înainte & După"
          title="Lucrări care vorbesc de la sine"
          subtitle="Vezi transformările realizate de echipa MST Service."
          align="center"
        />

        {/* Filtre */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {BEFORE_AFTER_FILTERS.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setFilter(category);
                setLightbox(null);
              }}
              className={
                'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ' +
                (filter === category
                  ? 'border-[#D50000] bg-[#D50000] text-white shadow-[0_0_15px_rgba(213,0,0,0.5)]'
                  : 'border-white/20 text-gray-300 hover:border-white/50 hover:text-white')
              }
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid proiecte */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: (index % 3) * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              onPointerDown={handleCardPointerDown}
              onPointerUp={(event) => handleCardPointerUp(event, index)}
              onPointerCancel={handleCardPointerCancel}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#111] transition-all duration-500 hover:-translate-y-1 hover:border-[#FF1A1A]/40 hover:shadow-[0_18px_50px_-20px_rgba(213,0,0,0.45)]"
            >
              <div className="relative">
                <BeforeAfterSlider
                  beforeImage={project.beforeImage}
                  afterImage={project.afterImage}
                  beforeAlt={`${project.vehicle} — înainte`}
                  afterAlt={`${project.vehicle} — după`}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/90">
                    Compară înainte / după
                  </span>
                  <Maximize2 className="h-4 w-4 text-white/80" aria-hidden="true" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#FF1A1A]/40 bg-[#FF1A1A]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF1A1A]">
                    {project.category}
                  </span>
                  {project.demo && (
                    <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                      DEMO
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#A0A0A0]">{project.vehicle}</p>
                <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">
                  {project.description}
                </p>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setLightbox(index);
                  }}
                  onPointerDown={(event) => event.stopPropagation()}
                  onPointerUp={(event) => event.stopPropagation()}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#FF1A1A] transition-colors hover:text-white"
                >
                  Vezi lucrarea
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4 md:p-8"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`Lucrarea ${activeProject.title}`}
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Închide"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-white/50 hover:bg-white/10"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                prevProject();
              }}
              aria-label="Lucrarea anterioară"
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-white/50 hover:bg-white/10 md:left-6"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextProject();
              }}
              aria-label="Lucrarea următoare"
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:border-white/50 hover:bg-white/10 md:right-6"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[90vh] w-full max-w-5xl overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <BeforeAfterSlider
                key={activeProject.id}
                beforeImage={activeProject.beforeImage}
                afterImage={activeProject.afterImage}
                beforeAlt={`${activeProject.vehicle} — înainte`}
                afterAlt={`${activeProject.vehicle} — după`}
                aspectClassName="aspect-[16/10] md:aspect-[16/9]"
                sizes="100vw"
                priority
              />

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#111] p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#FF1A1A]/40 bg-[#FF1A1A]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF1A1A]">
                    {activeProject.category}
                  </span>
                  {activeProject.demo && (
                    <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                      DEMO
                    </span>
                  )}
                </div>

                <h3 className="mt-4 text-xl font-semibold leading-snug text-white md:text-2xl">
                  {activeProject.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#A0A0A0]">{activeProject.vehicle}</p>
                <p className="mt-4 text-sm leading-relaxed text-[#A0A0A0] md:text-base">
                  {activeProject.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
