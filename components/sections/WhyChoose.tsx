'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { WHY_ITEMS } from '@/lib/data';

export default function WhyChoose() {
  return (
    <section
      id="despre"
      className="relative overflow-hidden bg-[#080808] py-24 md:py-32"
      aria-label="De ce noi"
    >
      <div
        className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(213,0,0,0.08),transparent_60%)] blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="De ce noi"
          title="De ce MST SERVICE?"
          subtitle="O echipă dedicată, echipamente profesionale și lucrări care sunt făcute corect, de prima dată."
          align="center"
        />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-all duration-500 hover:-translate-y-2 hover:border-[#FF1A1A]/40 hover:bg-white/[0.05]"
            >
              <CheckCircle2
                className="h-6 w-6 text-[#FF1A1A] transition-transform duration-500 group-hover:scale-110"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#A0A0A0]">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}