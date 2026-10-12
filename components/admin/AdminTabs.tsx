'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarClock, Car } from 'lucide-react';

const TABS = [
  { href: '/admin/programari', label: 'Programări', icon: CalendarClock },
  { href: '/admin/masini', label: 'Mașini de vânzare', icon: Car },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-8 flex gap-2">
      {TABS.map((tab) => {
        const active = pathname?.startsWith(tab.href);
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'border-[#FF1A1A]/50 bg-[#FF1A1A]/10 text-white'
                : 'border-white/10 bg-white/5 text-neutral-400 md:hover:border-white/20 md:hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
