import type { CSSProperties } from 'react';

export default function AboutHero() {
  return (
    <section className="wrap phero vs">
      <span className="eyebrow" data-t="pgAbE">About ZeroLag</span>
      <h1 className="h1 wd" data-words="" data-th="pgAbT" data-split="en">
        <span className="w" style={{ "--i": "0" } as CSSProperties}>Better</span>
        {" "}
        <span className="w" style={{ "--i": "1" } as CSSProperties}>connections.</span>
        <br />
        <span className="w" style={{ "--i": "2" } as CSSProperties}>Fewer</span>
        {" "}
        <span className="w" style={{ "--i": "3" } as CSSProperties}>complications.</span>
      </h1>
      <p className="lead rv" data-t="pgAbS">We're making a good connection feel as simple as pressing play.</p>
    </section>
  );
}
