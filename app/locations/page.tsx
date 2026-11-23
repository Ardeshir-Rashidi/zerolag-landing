import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import LocationsHero from '@/components/locations/LocationsHero';
import LocationList from '@/components/locations/LocationList';
import Talk from '@/components/shared/Talk';
import s from './locations.module.css';

export const metadata: Metadata = { title: 'ZeroLag · Locations' };

export default function LocationsPage() {
  return (
    <div className={`page ${s.root}`} data-page="locations">
      <LocationsHero />
      <LocationList />
      <Talk style={{ paddingBlock: "72px" } as CSSProperties} />
    </div>
  );
}
