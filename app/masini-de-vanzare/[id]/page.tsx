import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Fuel, Gauge, Calendar, Cog, Check } from 'lucide-react';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import CarGallery from '@/components/CarGallery';
import Reveal from '@/components/Reveal';
import { getCarById } from '@/lib/cars';
import { BUSINESS, SITE_URL } from '@/lib/constants';

export const dynamic = 'force-dynamic';

type CarDetailRouteProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: CarDetailRouteProps): Promise<Metadata> {
  const car = await getCarById(params.id);
  if (!car) return { title: 'Mașină indisponibilă' };

  const title = `${car.make} ${car.model} ${car.year}`;
  return {
    title,
    description: car.description || `${title} de vânzare la MST SERVICE.`,
    alternates: { canonical: `${SITE_URL}/masini-de-vanzare/${car.id}` },
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('ro-RO').format(price) + ' €';
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-[#FF1A1A]" aria-hidden="true" />
      <span className="text-[#A0A0A0]">
        {label}: <span className="font-semibold text-white">{value}</span>
      </span>
    </li>
  );
}

export default async function CarDetailPage({ params }: CarDetailRouteProps) {
  const car = await getCarById(params.id);
  if (!car) notFound();

  const specsLeft: { label: string; value: string }[] = [
    { label: 'Are VIN (Serie șasiu)', value: car.hasVin ? 'Da' : 'Nu' },
    { label: 'Anul producției', value: String(car.year) },
    { label: 'Km', value: `${new Intl.NumberFormat('ro-RO').format(car.mileage)} km` },
    ...(car.power ? [{ label: 'Putere', value: `${car.power} CP` }] : []),
    ...(car.engineCapacity ? [{ label: 'Capacitate cilindrică', value: `${new Intl.NumberFormat('ro-RO').format(car.engineCapacity)} cm3` }] : []),
  ];

  const specsRight: { label: string; value: string }[] = [
    { label: 'Număr de portiere', value: String(car.doors) },
    { label: 'Număr locuri', value: String(car.seats) },
    ...(car.paintType ? [{ label: 'Opțiuni culoare', value: car.paintType }] : []),
    ...(car.firstRegistration ? [{ label: 'Data primei înmatriculări', value: car.firstRegistration }] : []),
    { label: 'Stare', value: car.condition === 'nou' ? 'Nou' : 'Utilizat' },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pb-24 pt-32">
      <div
        className="pointer-events-none absolute -left-40 top-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.1),transparent_60%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Reveal>
            <CarGallery images={car.images} alt={`${car.make} ${car.model}`} />
          </Reveal>

          <Reveal delay={0.1}>
            {car.status === 'rezervat' && (
              <span className="mb-4 inline-block rounded-full bg-[#D50000] px-3 py-1 text-xs font-semibold text-white">
                Rezervată
              </span>
            )}
            {car.condition === 'nou' && car.status !== 'rezervat' && (
              <span className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#FF1A1A] to-orange-500 px-3 py-1 text-xs font-bold text-white">
                Nou
              </span>
            )}
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {car.make} {car.model}
            </h1>
            <p className="mt-2 bg-gradient-to-r from-[#FF1A1A] to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
              {formatPrice(car.price)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: Calendar, label: 'An', value: String(car.year) },
                { icon: Gauge, label: 'Kilometraj', value: `${new Intl.NumberFormat('ro-RO').format(car.mileage)} km` },
                { icon: Fuel, label: 'Combustibil', value: car.fuel },
                { icon: Cog, label: 'Cutie', value: car.transmission },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 md:hover:-translate-y-1 md:hover:border-[#FF1A1A]/40 md:hover:shadow-[0_10px_30px_-10px_rgba(213,0,0,0.4)]"
                >
                  <Icon className="h-5 w-5 text-[#FF1A1A] transition-transform duration-300 md:group-hover:scale-110" aria-hidden="true" />
                  <p className="mt-2 text-sm text-[#A0A0A0]">{label}</p>
                  <p className="font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>

            {car.description && (
              <p className="mt-8 leading-relaxed text-[#A0A0A0]">{car.description}</p>
            )}

            <div className="mt-10">
              <Button href={BUSINESS.phoneHref} size="lg" arrow>
                Sună pentru detalii: {BUSINESS.phone}
              </Button>
            </div>
          </Reveal>
        </div>

        {/* Specificații */}
        <Reveal delay={0.15}>
          <div className="mt-20 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)] sm:p-10">
            <h2 className="text-2xl font-bold text-white">Specificații</h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[#FF1A1A] to-orange-500" aria-hidden="true" />

            <div className="mt-8 grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
              <ul className="space-y-4">
                {specsLeft.map((spec) => (
                  <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                ))}
              </ul>
              <ul className="space-y-4">
                {specsRight.map((spec) => (
                  <SpecRow key={spec.label} label={spec.label} value={spec.value} />
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Dotări */}
        {car.features.length > 0 && (
          <Reveal delay={0.2}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)] sm:p-10">
              <h2 className="text-2xl font-bold text-white">Dotări</h2>
              <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-[#FF1A1A] to-orange-500" aria-hidden="true" />

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {car.features.map((feature) => (
                  <div
                    key={feature}
                    className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all duration-300 md:hover:border-[#FF1A1A]/40 md:hover:bg-black/60"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#FF1A1A] transition-transform duration-300 md:group-hover:scale-125" aria-hidden="true" />
                    <span className="text-sm font-medium text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>

      <div className="mt-24">
        <Footer />
      </div>
    </main>
  );
}
