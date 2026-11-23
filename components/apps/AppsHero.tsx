import type { CSSProperties } from 'react';

export default function AppsHero() {
  return (
    <section className="wrap phero phc vs">
      <span className="eyebrow" data-t="pgAppsE">Apps</span>
      <h1 className="h1 wd" data-words="" data-th="pgAppsT" data-split="en">
        <span className="w" style={{ "--i": "0" } as CSSProperties}>Your</span>
        {" "}
        <span className="w" style={{ "--i": "1" } as CSSProperties}>favorites.</span>
        <br />
        <span className="w" style={{ "--i": "2" } as CSSProperties}>Better</span>
        {" "}
        <span className="w" style={{ "--i": "3" } as CSSProperties}>connected.</span>
      </h1>
      <p className="lead rv" data-t="pgAppsS">
        The tools that block Iran, unblocked, plus the right route for the apps you use every day.
      </p>
    </section>
  );
}
