import Hero from '@/components/home/Hero';
import Why from '@/components/home/Why';
import Routing from '@/components/home/Routing';
import Stats from '@/components/home/Stats';
import Insights from '@/components/home/Insights';
import Features from '@/components/home/Features';
import Desktop from '@/components/home/Desktop';
import Mobile from '@/components/home/Mobile';
import GamesTeaser from '@/components/home/GamesTeaser';
import AppsTeaser from '@/components/home/AppsTeaser';
import Devices from '@/components/home/Devices';
import LocationsTeaser from '@/components/home/LocationsTeaser';
import PricingTeaser from '@/components/home/PricingTeaser';
import Faq from '@/components/home/Faq';
import Start from '@/components/home/Start';

export default function HomePage() {
  return (
    <div className="page" data-page="home">
      <Hero />
      <Why />
      <Routing />
      <Stats />
      <Insights />
      <Features />
      <Desktop />
      <Mobile />
      <GamesTeaser />
      <AppsTeaser />
      <Devices />
      <LocationsTeaser />
      <PricingTeaser />
      <Faq />
      <Start />
    </div>
  );
}
