'use client';

import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const value = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, value)));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[60] h-[2px] w-full max-w-full bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#D50000] to-[#FF1A1A] shadow-[0_0_12px_rgba(213,0,0,0.6)]"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

