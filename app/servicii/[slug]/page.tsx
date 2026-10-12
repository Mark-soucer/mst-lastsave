import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServicePage from '@/components/ServicePage';
import Footer from '@/components/Footer';
import { getServicePage, SERVICE_PAGES } from '@/lib/service-data';
import { SITE_URL } from '@/lib/constants';

type ServicePageRouteProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return SERVICE_PAGES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: ServicePageRouteProps): Metadata {
  const service = getServicePage(params.slug);

  if (!service) {
    return {
      title: 'Serviciu indisponibil | MST Service',
      description: 'Serviciul căutat nu este disponibil.',
    };
  }

  const canonicalUrl = `${SITE_URL}/servicii/${service.slug}`;
  const heroImageUrl = `${SITE_URL}${service.heroImage}`;

  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.seo.ogTitle ?? service.seo.title,
      description: service.seo.ogDescription ?? service.seo.description,
      url: canonicalUrl,
      siteName: 'MST SERVICE',
      locale: 'ro_RO',
      type: 'website',
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: service.heroImageAlt,
        },
      ],
    },
  };
}

export default function ServicePageRoute({ params }: ServicePageRouteProps) {
  const service = getServicePage(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <ServicePage service={service} />
      <Footer />
    </>
  );
}
