import type { Metadata } from 'next';
import PricingHero from '@/components/pricing/PricingHero';
import Plans from '@/components/pricing/Plans';
import BillingTwins from '@/components/pricing/BillingTwins';
import Compare from '@/components/pricing/Compare';
import PricingFaq from '@/components/pricing/PricingFaq';
import CantDecide from '@/components/pricing/CantDecide';
import s from './pricing.module.css';

export const metadata: Metadata = { title: 'ZeroLag · Pricing' };

export default function PricingPage() {
  return (
    <div className={`page ${s.root}`} data-page="pricing">
      <PricingHero />
      <Plans />
      <BillingTwins />
      <Compare />
      <PricingFaq />
      <CantDecide />
    </div>
  );
}
