'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

type CarGalleryProps = {
  images: string[];
  alt: string;
};

export default function CarGallery({ images, alt }: CarGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tastatură în vizualizarea mărită: Esc închide, săgețile schimbă poza.
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
      if (e.key === 'ArrowLeft') setActive((i) => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setActive((i) => (i === images.length - 1 ? 0 : i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomOpen, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[#A0A0A0]">
        Fără poze
      </div>
    );
  }

  const prev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div>
      <div
        className="group relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)]"
        onClick={() => setZoomOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Mărește poza"
        onKeyDown={(e) => {
          if (e.key === 'Enter') setZoomOpen(true);
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
          >
            <Image src={images[active]} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </motion.div>
        </AnimatePresence>
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white">
          <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          Mărește
        </span>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Poza anterioară"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition md:hover:bg-black/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Poza următoare"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition md:hover:bg-black/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {mounted && zoomOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setZoomOpen(false)}
          >
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              aria-label="Închide"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition md:hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Poza anterioară"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition md:hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Poza următoare"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition md:hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Imaginea originală, fără optimizare, ca să se vadă la rezoluție completă */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${alt} - poza ${active + 1}`}
              className="max-h-[92dvh] max-w-[95vw] select-none object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              {active + 1} / {images.length}
            </span>
          </div>,
          document.body
        )}

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border transition-all duration-300 md:hover:scale-105 ${
                i === active ? 'border-[#FF1A1A] shadow-[0_0_15px_rgba(255,26,26,0.4)]' : 'border-white/10 opacity-70 md:hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${alt} - poza ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
