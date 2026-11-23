import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import AppsHero from '@/components/apps/AppsHero';
import AppLibrary from '@/components/apps/AppLibrary';
import Steps from '@/components/shared/Steps';
import Talk from '@/components/shared/Talk';
import s from './apps.module.css';

export const metadata: Metadata = { title: 'ZeroLag · Apps' };

export default function AppsPage() {
  return (
    <div className={`page ${s.root}`} data-page="apps">
      <AppsHero />
      <AppLibrary />
      <Steps />
      <Talk style={{ paddingBottom: "72px" } as CSSProperties} />
    </div>
  );
}
