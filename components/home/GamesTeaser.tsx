import Link from 'next/link';
import s from './GamesTeaser.module.css';

export default function GamesTeaser() {
  return (
    <section className={`sec ${s.root}`} id="h-games">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="gE">Built for play</span>
          <div>
            <h2 className="h2 rv" data-t="gT">Your games. One connection.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="gS">Ready-made profiles for 40+ games and every big launcher.</p>
            <Link className="btn line rv" href="/games" data-t="viewGames">View all games</Link>
          </div>
        </div>
        {" "}
        <div className="mq" id="gMq" data-sfx="drift" />
        {" "}
      </div>
      {" "}
    </section>
  );
}
