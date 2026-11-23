import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './styles/zerolag-map.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/shared.css';
import './styles/frame.css';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import { SkipLink, Progress, Toast } from '@/components/layout/Chrome';
import SiteRuntime from '@/components/SiteRuntime';

export const metadata: Metadata = {
  title: 'ZeroLag Landing',
  description: 'ZeroLag lowers your ping, unblocks games and tools that block Iran, and shows every millisecond. Windows, macOS, Android and iOS.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="js">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" />
      </head>
      <body>
        <SkipLink />
        <Progress />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Toast />
        <SiteRuntime />
      </body>
    </html>
  );
}
