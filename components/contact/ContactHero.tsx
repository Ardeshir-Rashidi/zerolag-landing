import type { CSSProperties } from 'react';

export default function ContactHero() {
  return (
    <section className="wrap phero vs">
      <span className="eyebrow" data-t="pgCtE">Contact us</span>
      <h1 className="h1 wd" data-words="" data-th="pgCtT" data-split="en">
        <span className="w" style={{ "--i": "0" } as CSSProperties}>A</span>
        {" "}
        <span className="w" style={{ "--i": "1" } as CSSProperties}>real</span>
        {" "}
        <span className="w" style={{ "--i": "2" } as CSSProperties}>conversation.</span>
        <br />
        <span className="w" style={{ "--i": "3" } as CSSProperties}>A</span>
        {" "}
        <span className="w" style={{ "--i": "4" } as CSSProperties}>clearer</span>
        {" "}
        <span className="w" style={{ "--i": "5" } as CSSProperties}>connection.</span>
      </h1>
      <p className="lead rv" data-t="pgCtS">Talk to the people behind ZeroLag.</p>
    </section>
  );
}
