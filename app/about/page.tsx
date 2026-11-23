import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import AboutHero from '@/components/about/AboutHero';
import Flow from '@/components/about/Flow';
import Story from '@/components/about/Story';
import Figures from '@/components/about/Figures';
import Talk from '@/components/shared/Talk';
import s from './about.module.css';

export const metadata: Metadata = { title: 'ZeroLag · About' };

export default function AboutPage() {
  return (
    <div className={`page ${s.root}`} data-page="about">
      <AboutHero />
      <Flow />
      <Story />
      <Figures />
      <Talk style={{ paddingBottom: "72px" } as CSSProperties} />
    </div>
  );
}
