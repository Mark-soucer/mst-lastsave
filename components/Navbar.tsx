'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Calendar } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Button from '@/components/Button';
import { useAppointment } from '@/context/AppointmentContext';

const navLinks = [
  { label: 'Acasă', href: '#acasa' },
  { label: 'Servicii', href: '#servicii' },
  { label: 'De ce noi', href: '#despre' },
  { label: 'Galerie', href: '#lucrari' },
  { label: 'Status', href: '/status' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { openAppointment } = useAppointment();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('#acasa');

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return;
    if (pathname?.startsWith('/status')) {
      setScrolled(true);
      setActiveLink('/status');
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 48);
      const current = navLinks
        .map((l) => l.href.slice(1))
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top } : { id, top: -Infinity };
        })
        .filter((s) => s.top <= window.innerHeight * 0.4)
        .sort((a, b) => b.top - a.top)[0];
      if (current) setActiveLink(`#${current.id}`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Don't render the public site Navbar on Admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const getLinkHref = (href: string) => {
    if (href.startsWith('/')) {
      return href;
    }
    return pathname === '/' ? href : `/${href}`;
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
        className={
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ' +
          (scrolled
            ? 'border-b border-white/10 bg-[#080808]/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'border-b border-transparent bg-transparent')
        }
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
          {/* Brand Logo - Crisp & Transparent Seamless Integration */}
          <a
            href={getLinkHref('#acasa')}
            className="group relative z-[60] flex items-center transition-transform duration-300 hover:scale-[1.03]"
            aria-label="MST SERVICE - Acasă"
          >
            {/* Ambient neon red backlight on hover */}
            <div
              className="pointer-events-none absolute -inset-2 rounded-full bg-[#FF1A1A]/20 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden="true"
            />

            {/* Transparent High-Res Logo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-mst-transparent.png"
              alt="MST SERVICE"
              className="h-10 w-auto object-contain drop-shadow-[0_2px_12px_rgba(255,26,26,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_20px_rgba(255,26,26,0.7)] md:h-12"
            />
          </a>

          {/* Desktop menu */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigare principală">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={getLinkHref(link.href)}
                className={
                  'relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ' +
                  (activeLink === link.href ? 'text-white' : 'text-[#A0A0A0] hover:text-white')
                }
              >
                {link.label}
                <span
                  className={
                    'absolute inset-x-4 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-[#FF1A1A] to-transparent transition-all duration-300 ' +
                    (activeLink === link.href
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-50')
                  }
                />
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button onClick={() => openAppointment()} size="md" magnetic>
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Programează-te
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
            aria-expanded={open}
            className="relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at top right)' }}
            animate={{ clipPath: 'circle(140% at top right)' }}
            exit={{ clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-[#080808]/95 backdrop-blur-2xl md:hidden"
          >
            <nav
              className="flex flex-1 flex-col items-center justify-center gap-2 px-6"
              aria-label="Meniu mobil"
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={getLinkHref(link.href)}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className={
                    'py-3 text-3xl font-bold tracking-tight transition-colors ' +
                    (activeLink === link.href ? 'text-white' : 'text-[#A0A0A0] hover:text-white')
                  }
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="px-8 pb-12"
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openAppointment();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#D50000] px-6 py-4 text-sm font-bold text-white shadow-[0_0_24px_rgba(213,0,0,0.5)] transition hover:bg-[#FF1A1A]"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Programează-te Online
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}