'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import { GALLERY_IMAGES, GALLERY_FILTERS } from '@/lib/data';

export default function Gallery() {
  const [filter, setFilter] = useState('Toate');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === 'Toate'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === filter);

  const next = () =>
    setLightbox((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : prev));
  const prev = () =>
    setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

  return (
    <section
      id="galerie"
      className="relative overflow-hidden bg-[#0B0B0B] py-24 md:py-32"
      aria-label="Galerie"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Galerie"
          title="Lucrările noastre"
          subtitle="Exemple din activitatea noastră, din atelier."
          align="center"
        />

        {/* Filters */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {GALLERY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 border ' +
                (filter === cat
                  ? 'bg-[#D50000] border-[#D50000] text-white shadow-[0_0_15px_rgba(213,0,0,0.5)]'
                  : 'border-white/20 text-gray-300 hover:border-white/50 hover:text-white')
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((img, idx) => (
            <motion.div
              key={`${filter}-${img.src}`}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-white/10"
              onClick={() => setLightbox(idx)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width:768px) 100vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {img.alt}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightbox(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Vizualizare imagine"
          >
            <button
              onClick={() => setLightbox(null)}
              aria-label="Închide"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Imaginea anterioară"
              className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Imaginea următoare"
              className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="relative h-[70vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
