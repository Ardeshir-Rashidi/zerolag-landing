import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import DownloadHero from '@/components/download/DownloadHero';
import DownloadDevices from '@/components/download/DownloadDevices';
import Talk from '@/components/shared/Talk';
import s from './download.module.css';

export const metadata: Metadata = { title: 'ZeroLag · Download' };

export default function DownloadPage() {
  return (
    <div className={`page ${s.root}`} data-page="download">
      <DownloadHero />
      <DownloadDevices />
      <Talk style={{ paddingBottom: "72px" } as CSSProperties} />
    </div>
  );
}
