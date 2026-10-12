'use client';
import { Phone, MapPin, Mail, Clock, ChevronRight, Calendar } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import { CONTACT_ITEMS } from '@/lib/data';
import { useAppointment } from '@/context/AppointmentContext';

export default function Contact() {
  const { openAppointment } = useAppointment();

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#080808] py-24 md:py-32"
      aria-label="Contact"
    >
      <div
        className="absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.1),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Contact & Programări"
          title="Hai să vorbim"
          subtitle="Programează-ți mașina online în mai puțin de 1 minut sau sună-ne direct."
          align="center"
        />

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_ITEMS.map((item) => {
            const Icon = item.icon;
            const isLink = Boolean(item.href);
            const content = (
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-500 md:hover:-translate-y-1 md:hover:border-[#FF1A1A]/40 md:hover:shadow-[0_10px_30px_rgba(213,0,0,0.15)]">
                <Icon className="h-6 w-6 text-[#FF1A1A]" aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-medium text-white">{item.value}</p>
              </div>
            );
            return isLink ? (
              <a
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className="group"
              >
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={() => openAppointment()} size="lg" magnetic>
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Programează-te Online
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>

          <Button href="tel:+40757240854" variant="outline" size="lg">
            <Phone className="h-4 w-4 text-[#FF1A1A]" aria-hidden="true" />
            Sună direct: 0757 240 854
          </Button>
        </div>
      </div>
    </section>
  );
}
