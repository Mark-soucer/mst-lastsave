'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Fuel, Gauge, Calendar } from 'lucide-react';
import type { CarRecord } from '@/lib/cars';

function formatPrice(price: number) {
  return new Intl.NumberFormat('ro-RO').format(price) + ' €';
}

export default function CarListingGrid({ cars }: { cars: CarRecord[] }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car, i) => (
        <motion.div
          key={car.id}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 md:hover:-translate-y-2 md:hover:border-[#FF1A1A]/40 md:hover:shadow-[0_20px_60px_-15px_rgba(213,0,0,0.4)]"
        >
          <Link href={`/masini-de-vanzare/${car.id}`} className="absolute inset-0 z-20" aria-label={`${car.make} ${car.model}`} />

          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 md:group-hover:opacity-100"
            style={{
              background: 'linear-gradient(135deg, rgba(255,26,26,0.25), transparent 40%, transparent 60%, rgba(255,26,26,0.25))',
            }}
            aria-hidden="true"
          />

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5">
            {car.images[0] ? (
              <Image
                src={car.images[0]}
                alt={`${car.make} ${car.model}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[#A0A0A0]">Fără poză</div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />

            {car.status === 'rezervat' && (
              <span className="absolute left-3 top-3 rounded-full bg-[#D50000] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                Rezervată
              </span>
            )}
            {car.condition === 'nou' && car.status !== 'rezervat' && (
              <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#FF1A1A] to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                Nou
              </span>
            )}
          </div>

          <div className="relative p-6">
            <h3 className="text-xl font-bold text-white transition-colors duration-300 md:group-hover:text-[#FF1A1A]">
              {car.make} {car.model}
            </h3>
            <p className="mt-1 text-2xl font-bold text-[#FF1A1A]">{formatPrice(car.price)}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-[#A0A0A0]">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#FF1A1A]/70" aria-hidden="true" />
                {car.year}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Gauge className="h-4 w-4 text-[#FF1A1A]/70" aria-hidden="true" />
                {new Intl.NumberFormat('ro-RO').format(car.mileage)} km
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Fuel className="h-4 w-4 text-[#FF1A1A]/70" aria-hidden="true" />
                {car.fuel}
              </span>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[#FF1A1A] opacity-0 transition-all duration-300 md:group-hover:opacity-100">
              <span>Vezi detalii</span>
              <span className="transition-transform duration-300 md:group-hover:translate-x-1">→</span>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/0 transition-all duration-500 md:group-hover:ring-[#FF1A1A]/20"
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
}
