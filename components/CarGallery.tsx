'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarGalleryProps = {
  images: string[];
  alt: string;
};

export default function CarGallery({ images, alt }: CarGalleryProps) {
  const [active, setActive] = useState(0);

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
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
          >
            <Image src={images[active]} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
          </motion.div>
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Poza anterioară"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition md:hover:bg-black/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Poza următoare"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white transition md:hover:bg-black/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

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
