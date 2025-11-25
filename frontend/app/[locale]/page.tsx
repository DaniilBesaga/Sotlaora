import React from 'react';
import Link from 'next/link';
import HeroSection from '../[locale]/components/ui/home/HeroSection';
import { ServicesSection } from '../[locale]/components/ui/home/Services';
import WhyUs from '../[locale]/components/ui/home/WhyUs';
import TrustSection from '../[locale]/components/ui/home/TrustSection';
import PopularPros from '../[locale]/components/ui/home/PopularPros';
import HowItWorks from '../[locale]/components/ui/home/HowItWorks';
import PricingSection from '../[locale]/components/ui/home/PricingSection';
import FAQ from '../[locale]/components/ui/home/FAQ';
import ForProsSection from '../[locale]/components/ui/home/ForProsSection';
import CallSection from '../[locale]/components/ui/home/CallSection';

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
