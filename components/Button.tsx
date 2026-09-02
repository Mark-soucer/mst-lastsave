'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode, MouseEvent } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  magnetic?: boolean;
  arrow?: boolean;
  external?: boolean;
};

function magneticHandler(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  el.style.translate = `${x * 0.12}px ${y * 0.12}px`;
}

function magneticReset(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.translate = '0px 0px';
}

const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    children,
    href,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    magnetic = false,
    arrow = true,
    external = false,
  },
  ref,
) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold tracking-wide transition-transform duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#FF1A1A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808] whitespace-nowrap';

  const variants: Record<string, string> = {
    primary:
      'bg-[#D50000] text-white hover:bg-[#FF1A1A] shadow-[0_0_24px_rgba(213,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-[0_0_40px_rgba(255,26,26,0.6)]',
    secondary: 'bg-white text-[#080808] hover:bg-[#e5e5e5]',
    outline:
      'border border-white/25 text-white hover:border-white/60 hover:bg-white/5',
  };

  const sizes: Record<string, string> = {
    md: 'px-6 py-3 text-sm',
    lg: 'px-7 py-3.5 text-sm md:px-8 md:py-4 md:text-base',
  };

  const shine =
    variant === 'primary'
      ? 'before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 group-hover:before:translate-x-full'
      : '';

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </>
  );

  const hoverHandlers = magnetic
    ? { onMouseMove: magneticHandler as never, onMouseLeave: magneticReset as never }
    : {};

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${shine} ${className}`;

  if (href) {
    const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <Link
        ref={ref as never}
        href={href}
        onClick={onClick}
        className={classes}
        {...hoverHandlers}
        {...externalProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <motion.button
      ref={ref as never}
      type={type}
      whileHover={{ scale: magnetic ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={classes}
      {...hoverHandlers}
    >
      {content}
    </motion.button>
  );
});

export default Button;