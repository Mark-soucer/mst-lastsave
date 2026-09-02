'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  return (
    <div className={`flex flex-col ${alignment} gap-4 ${className}`}>
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#FF1A1A]"
        >
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#FF1A1A]" aria-hidden="true" />
          {eyebrow}
          {align === 'center' && (
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#FF1A1A]" aria-hidden="true" />
          )}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: 0.08 }}
        className="max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="max-w-2xl text-base leading-relaxed text-[#A0A0A0] md:text-lg"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}