import type { CSSProperties } from 'react';

export default function LocationsHero() {
  return (
    <section className="wrap phero lochero vs">
      <span className="eyebrow" data-t="pgLocE">Locations</span>
      <h1 className="h1 wd" data-words="" data-th="pgLocT" data-split="en">
        <span className="w" style={{ "--i": "0" } as CSSProperties}>A</span>
        {" "}
        <span className="w" style={{ "--i": "1" } as CSSProperties}>global</span>
        {" "}
        <span className="w" style={{ "--i": "2" } as CSSProperties}>network.</span>
        <br />
        <span className="w" style={{ "--i": "3" } as CSSProperties}>A</span>
        {" "}
        <span className="w" style={{ "--i": "4" } as CSSProperties}>local</span>
        {" "}
        <span className="w" style={{ "--i": "5" } as CSSProperties}>connection.</span>
      </h1>
      <p className="lead rv" data-t="pgLocS">Explore the regions behind your next connection.</p>
      <div className="world wp" aria-hidden="true">
        <div className="map" id="wMap" />
      </div>
    </section>
  );
}
