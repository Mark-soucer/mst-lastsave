'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_HOME_TEXT, type HomeText } from '@/lib/site-text-shared';

const SiteTextContext = createContext<HomeText>(DEFAULT_HOME_TEXT);

export function SiteTextProvider({ value, children }: { value: HomeText; children: ReactNode }) {
  return <SiteTextContext.Provider value={value}>{children}</SiteTextContext.Provider>;
}

export function useSiteText(): HomeText {
  return useContext(SiteTextContext);
}
