import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import AppointmentModal from '@/components/AppointmentModal';
import FloatingBooking from '@/components/FloatingBooking';
import { AppointmentProvider } from '@/context/AppointmentContext';

const SITE_URL = 'https://mstservice.ro';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MST SERVICE — Service auto premium în Galați',
    template: '%s | MST SERVICE',
  },
  description:
    'Service auto premium în Galați pentru mecanică, tinichigerie, vopsitorie, geometrie și vulcanizare. Programează-te online sau urmărește statusul mașinii tale în timp real.',
  applicationName: 'MST SERVICE',
  keywords: [
    'service auto Galați',
    'mecanică auto Galați',
    'tinichigerie Galați',
    'vopsitorie auto Galați',
    'geometrie roți Galați',
    'vulcanizare Galați',
    'service auto premium',
    'reparații auto Galați',
  ],
  authors: [{ name: 'MST SERVICE' }],
  creator: 'MST SERVICE',
  publisher: 'MST SERVICE',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: SITE_URL,
    siteName: 'MST SERVICE',
    title: 'MST SERVICE — Service auto premium în Galați',
    description:
      'Service auto premium în Galați pentru mecanică, tinichigerie, vopsitorie, geometrie și vulcanizare.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MST SERVICE — Service auto premium în Galați',
    description:
      'Service auto premium în Galați pentru mecanică, tinichigerie, vopsitorie, geometrie și vulcanizare.',
  },
  icons: {
    icon: '/images/logo-mst-transparent.png',
    apple: '/images/logo-mst-transparent.png',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'MST SERVICE',
  description:
    'Service auto premium în Galați pentru mecanică, tinichigerie, vopsitorie, geometrie și vulcanizare.',
  url: SITE_URL,
  telephone: '+40757240854',
  image: `${SITE_URL}/images/LogoMST.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Strada Vasile Alecsandri Nr. 1',
    addressLocality: 'Galați',
    postalCode: '807326',
    addressCountry: 'RO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.4303,
    longitude: 28.0384,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '16:30',
    },
  ],
  priceRange: '$$',
  areaServed: 'Galați, România',
  currenciesAccepted: 'RON',
  paymentAccepted: 'Cash, Card',
  sameAs: [SITE_URL],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <AppointmentProvider>
          <ScrollProgress />
          <div className="relative flex min-h-screen w-full max-w-full flex-col overflow-x-hidden">
            <Navbar />
            <main className="main relative w-full max-w-full flex-1 overflow-x-hidden">
              {children}
            </main>
          </div>
          <FloatingBooking />
          <AppointmentModal />
        </AppointmentProvider>
      </body>
    </html>
  );
}