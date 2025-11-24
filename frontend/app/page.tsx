import React from 'react';
import Link from 'next/link';
import HeroSection from './components/ui/home/HeroSection';
import { ServicesSection } from './components/ui/home/Services';
import WhyUs from './components/ui/home/WhyUs';
import TrustSection from './components/ui/home/TrustSection';
import PopularPros from './components/ui/home/PopularPros';
import HowItWorks from './components/ui/home/HowItWorks';
import PricingSection from './components/ui/home/PricingSection';
import FAQ from './components/ui/home/FAQ';
import ForProsSection from './components/ui/home/ForProsSection';
import CallSection from './components/ui/home/CallSection';

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <ServicesSection/>
      <WhyUs/>
      <TrustSection/>
      <PopularPros/>
      <HowItWorks/>
      <CallSection/>
      <PricingSection/>
      <FAQ/>
      <ForProsSection/>
    </div>
  );
}
