'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  aspectClassName?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Înainte',
  afterAlt = 'După',
  aspectClassName = 'aspect-[4/3]',
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(50);

  const updateFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;

    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const stopDragging = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      setPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Compară imaginea înainte cu imaginea după"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      className={`relative w-full touch-none select-none overflow-hidden rounded-2xl border border-white/10 bg-[#111] outline-none focus-visible:ring-2 focus-visible:ring-[#FF1A1A]/70 ${aspectClassName} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onKeyDown={handleKeyDown}
    >
      {/* Imaginea ÎNAINTE, sub separator */}
      <Image
        src={beforeImage}
        alt={beforeAlt}
        fill
        draggable={false}
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />

      {/* Imaginea DUPĂ, decupată din stânga în funcție de poziția separatorului */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          draggable={false}
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>

      {/* Indicatori */}
      <span
        className={`pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition-opacity duration-300 ${position < 50 ? 'opacity-100' : 'opacity-35'
          }`}
      >
        Înainte
      </span>
      <span
        className={`pointer-events-none absolute right-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition-opacity duration-300 ${position > 50 ? 'opacity-100' : 'opacity-35'
          }`}
      >
        După
      </span>

      {/* Separator vertical */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 left-0 w-[2px] -translate-x-1/2 bg-white/90 shadow-[0_0_14px_rgba(255,255,255,0.55)]" />
        <div
          className="absolute left-0 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D50000]/30 blur-xl animate-pulse"
          aria-hidden="true"
        />
        <div className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-[#D50000] text-white shadow-[0_0_22px_rgba(213,0,0,0.65)]">
          <ChevronsLeftRight className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
