'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Info,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { SERVICE_ADVANTAGES } from '@/lib/service-data';
import type { ServicePageData } from '@/lib/service-data';
import { SERVICE_ICONS } from '@/lib/service-icons';
import { useAppointment } from '@/context/AppointmentContext';

type IntroCardProps = {
  icon: LucideIcon;
  title: string;
  items: string[];
};

function IntroCard({ icon: Icon, title, items }: IntroCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D50000]/20 to-transparent text-[#FF1A1A] ring-1 ring-white/10">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#A0A0A0]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FF1A1A]" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

type ServicePageProps = {
  service: ServicePageData;
};

export default function ServicePage({ service }: ServicePageProps) {
  const { openAppointment } = useAppointment();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const HeroIcon = SERVICE_ICONS[service.icon];

  const handleBook = () => {
    openAppointment(service.appointmentServiceName);
  };

  return (
    <div className="relative w-full max-w-full overflow-x-hidden bg-[#080808]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#080808] pt-32 pb-20 md:pt-44 md:pb-28">
        <div
          className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.16),transparent_60%)] blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.3em] text-[#A0A0A0] backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF1A1A] shadow-[0_0_8px_rgba(255,26,26,0.9)]" aria-hidden="true" />
              Servicii MST Service
            </span>

            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D50000]/20 to-transparent text-[#FF1A1A] ring-1 ring-white/10 shadow-[0_0_25px_rgba(255,26,26,0.35)]">
                <HeroIcon className="h-8 w-8" aria-hidden="true" />
              </div>
              <h1 className="font-display text-4xl font-bold leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {service.title}
              </h1>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#A0A0A0] md:text-lg">
              {service.heroSubtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button onClick={handleBook} size="lg" magnetic>
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Programează-te
              </Button>
              {service.gallery && (
                <Button href="#galerie" variant="outline" size="lg">
                  Vezi lucrările
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div
              className="absolute inset-0 -m-6 rounded-[2rem] bg-[radial-gradient(circle,rgba(213,0,0,0.22),transparent_65%)] blur-2xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0B0B0B]">
                <Image
                  src={service.heroImage}
                  alt={service.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-6"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* INTRODUCERE */}
      <section className="relative overflow-hidden bg-[#0B0B0B] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Despre serviciu"
            title={`Ce presupune ${service.title}`}
            subtitle="Înțelegi exact ce verificăm, când este recomandat să vii și ce probleme rezolvăm."
            align="center"
          />

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <IntroCard icon={Info} title="Ce presupune" items={service.intro.what} />
            <IntroCard icon={Clock} title="Când este necesar" items={service.intro.when} />
            <IntroCard icon={Wrench} title="Ce probleme rezolvăm" items={service.intro.problems} />
          </div>
        </div>
      </section>

      {/* CE INCLUDE */}
      <section className="relative overflow-hidden bg-[#0A0A0A] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="Ce include"
            title="Operațiunile principale"
            subtitle={`Serviciul ${service.title} acoperă intervențiile esențiale de care mașina ta are nevoie.`}
            align="center"
          />

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {service.includes.map((feature, index) => {
              const FeatureIcon = SERVICE_ICONS[feature.icon];
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: (index % 3) * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-[#FF1A1A]/40 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_-15px_rgba(213,0,0,0.4)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#D50000]/20 to-transparent text-[#FF1A1A] ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,26,26,0.4)]">
                    <FeatureIcon className="h-7 w-7 transition-transform duration-500 group-hover:-rotate-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A0A0A0]">{feature.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* DE CE MST SERVICE */}
      <section className="relative overflow-hidden bg-[#0B0B0B] py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHeading
            eyebrow="De ce MST Service"
            title="Avantaje care fac diferența"
            subtitle="Aceeași echipă, aceleași standarde premium pentru fiecare lucrare."
            align="center"
          />

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {SERVICE_ADVANTAGES.map((advantage, index) => {
              const AdvantageIcon = SERVICE_ICONS[advantage.icon];
              return (
                <motion.article
                  key={advantage.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: (index % 5) * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:border-[#FF1A1A]/40"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#D50000]/20 to-transparent text-[#FF1A1A] ring-1 ring-white/10">
                    <AdvantageIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-base font-semibold text-white">{advantage.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">{advantage.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERIE */}
      {service.gallery && (
        <section id="galerie" className="relative overflow-hidden bg-[#0A0A0A] py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <SectionHeading
              eyebrow="Galerie"
              title={service.gallery.title}
              subtitle={service.gallery.subtitle}
              align="center"
            />

            {service.gallery.type === 'before-after' ? (
              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                {service.gallery.projects.map((project, index) => (
                  <motion.figure
                    key={project.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: (index % 2) * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="group"
                  >
                    <BeforeAfterSlider
                      beforeImage={project.beforeImage}
                      afterImage={project.afterImage}
                      beforeAlt={`${project.vehicle} — înainte`}
                      afterAlt={`${project.vehicle} — după`}
                      aspectClassName="aspect-[4/3]"
                    />
                    <figcaption className="mt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[#FF1A1A]/40 bg-[#FF1A1A]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF1A1A]">
                          {project.category}
                        </span>
                        {project.demo && (
                          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                            DEMO
                          </span>
                        )}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold leading-snug text-white">{project.title}</h3>
                      <p className="mt-1 text-sm font-medium text-[#A0A0A0]">{project.vehicle}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">{project.description}</p>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            ) : (
              <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {service.gallery.images.map((image, index) => (
                  <motion.figure
                    key={image.src}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: (index % 2) * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5">
                      <span className="text-sm font-medium text-white">{image.alt}</span>
                    </figcaption>
                  </motion.figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="relative overflow-hidden bg-[#0B0B0B] py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <SectionHeading
            eyebrow="FAQ"
            title="Întrebări frecvente"
            subtitle="Răspunsuri clare, ca la o discuție directă în atelier."
            align="center"
          />
          <div className="mt-14 space-y-4">
            {service.faq.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-base font-semibold text-white md:text-lg">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#FF1A1A] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm leading-relaxed text-[#A0A0A0]">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-[#080808] py-24 md:py-32">
        <div
          className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-1/2 h-[320px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(213,0,0,0.14),transparent_70%)] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center md:px-8">
          <SectionHeading
            eyebrow="Programare"
            title={service.cta.title}
            subtitle={service.cta.subtitle}
            align="center"
          />
          <div className="mt-10 flex justify-center">
            <Button onClick={handleBook} size="lg" magnetic>
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {service.cta.buttonLabel}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

