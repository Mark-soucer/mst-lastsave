import type { LucideIcon } from 'lucide-react';
import { SERVICE_PAGES } from '@/lib/service-data';
import { SERVICE_ICONS } from '@/lib/service-icons';

export type Service = {
  id: string;
  slug: string;
  icon: LucideIcon;
  title: string;
  short: string;
  description: string;
  problems: string[];
  includes: string[];
};

export const SERVICES: Service[] = SERVICE_PAGES.map((service) => ({
  id: service.slug,
  slug: service.slug,
  icon: SERVICE_ICONS[service.icon],
  title: service.title,
  short: service.short,
  description: service.intro.what.join(' '),
  problems: service.intro.problems,
  includes: service.includes.map((feature) => feature.title),
}));