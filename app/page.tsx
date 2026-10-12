import Hero from '@/components/Hero';
import Services from '@/components/sections/Services';
import WhyChoose from '@/components/sections/WhyChoose';
import BeforeAfter from '@/components/sections/BeforeAfter';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative w-full max-w-full">

      <Hero />
      <Services />
      <WhyChoose />
      <BeforeAfter />
      <Contact />
      <Footer />
    </div>
  );
}