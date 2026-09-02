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
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#080808]"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative"
          >
            {/* Floating logo with shine sweep */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
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
                  initial={{ x: '-120%' }}
                  animate={{ x: '120%' }}
                  transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
