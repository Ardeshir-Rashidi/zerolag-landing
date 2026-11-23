import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import GamesHero from '@/components/games/GamesHero';
import GameLibrary from '@/components/games/GameLibrary';
import Launchers from '@/components/games/Launchers';
import Steps from '@/components/shared/Steps';
import Talk from '@/components/shared/Talk';
import s from './games.module.css';

export const metadata: Metadata = { title: 'ZeroLag · Games' };

export default function GamesPage() {
  return (
    <div className={`page ${s.root}`} data-page="games">
      <GamesHero />
      <GameLibrary />
      <Launchers />
      <Steps />
      <Talk style={{ paddingBottom: "72px" } as CSSProperties} />
    </div>
  );
}
