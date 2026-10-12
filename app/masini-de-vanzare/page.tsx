import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import SectionHeading from '@/components/SectionHeading';
import CarListingGrid from '@/components/CarListingGrid';
import { getCars } from '@/lib/cars';
import { SITE_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mașini de vânzare',
  description: 'Mașini verificate și pregătite de MST SERVICE, disponibile la vânzare în Galați.',
  alternates: { canonical: `${SITE_URL}/masini-de-vanzare` },
};

export default async function CarsForSalePage() {
  const allCars = await getCars();
  const cars = allCars.filter((c) => c.status !== 'vandut');

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pb-24 pt-32">
      <div
        className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.1),transparent_60%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Mașini de vânzare"
          title="Mașini verificate, pregătite de echipa noastră"
          subtitle="Fiecare mașină trece prin verificările noastre tehnice înainte de a fi listată."
          align="left"
        />

        {cars.length === 0 ? (
          <p className="mt-16 text-[#A0A0A0]">Momentan nu există mașini disponibile. Revino curând.</p>
        ) : (
          <div className="mt-16">
            <CarListingGrid cars={cars} />
          </div>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
