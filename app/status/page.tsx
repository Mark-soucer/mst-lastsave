import type { Metadata } from 'next';
import StatusLookup from '@/components/status/StatusLookup';

export const metadata: Metadata = {
  title: 'Status comandă | MST Service',
  description:
    'Verifică statusul comenzii tale auto la MST Service. Introdu codul unic primit de la service.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StatusIndexPage() {
  return <StatusLookup />;
}
