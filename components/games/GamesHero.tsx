import type { CSSProperties } from 'react';

export default function GamesHero() {
  return (
    <section className="wrap phero vs">
      <span className="eyebrow" data-t="pgGamesE">Games</span>
      <h1 className="h1 wd" data-words="" data-th="pgGamesT" data-split="en">
        <span className="w" style={{ "--i": "0" } as CSSProperties}>Ready</span>
        {" "}
        <span className="w" style={{ "--i": "1" } as CSSProperties}>for</span>
        {" "}
        <span className="w" style={{ "--i": "2" } as CSSProperties}>your</span>
        <br />
        <span className="w" style={{ "--i": "3" } as CSSProperties}>next</span>
        {" "}
        <span className="w" style={{ "--i": "4" } as CSSProperties}>session.</span>
      </h1>
      <p className="lead rv" data-t="pgGamesS">Browse game profiles and find the best route for every match.</p>
    </section>
  );
}
