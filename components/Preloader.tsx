'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsTouch } from '@/hooks/useIsTouch';
import { logger } from '@/lib/utils';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const isTouch = useIsTouch();

  useEffect(() => {
    const start = performance.now();
    const duration = isTouch ? 1300 : 1800;

    const timeout = setTimeout(() => {
      logger.elapsed(`Preloader done in ${Math.round(performance.now() - start)}ms`);
      setLoading(false);
    }, duration + 300);

    return () => clearTimeout(timeout);
  }, [isTouch]);

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080808]"
          aria-hidden="true"
        >
          <motion.div
            className="relative"
          >
            {/* Floating logo with shine sweep */}
            <motion.div
              className="relative"
            >
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/images/logo-mst-transparent.png"
                  alt="MST SERVICE"
                  width={1024}
                  height={301}
                  priority
                  className="h-auto w-52 drop-shadow-[0_0_25px_rgba(213,0,0,0.35)] md:w-72"
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
