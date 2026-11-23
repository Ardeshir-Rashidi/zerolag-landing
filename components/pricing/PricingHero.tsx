import type { CSSProperties } from 'react';

export default function PricingHero() {
  return (
    <section className="wrap prhero vs">
      {" "}
      <h1 className="h1 wd" data-words="" data-th="pT" data-split="en">
        <span className="w" style={{ "--i": "0" } as CSSProperties}>A</span>
        {" "}
        <span className="w" style={{ "--i": "1" } as CSSProperties}>plan</span>
        {" "}
        <span className="w" style={{ "--i": "2" } as CSSProperties}>for</span>
        {" "}
        <span className="w" style={{ "--i": "3" } as CSSProperties}>every</span>
        <br />
        <span className="w" style={{ "--i": "4" } as CSSProperties}>way</span>
        {" "}
        <span className="w" style={{ "--i": "5" } as CSSProperties}>you</span>
        {" "}
        <span className="w" style={{ "--i": "6" } as CSSProperties}>connect.</span>
      </h1>
      {" "}
      <div className="prhero-r rv">
        <p className="lead" data-t="pS">Simple subscriptions. Clear limits. Room to grow.</p>
        <div className="seg box bill" id="bill" />
      </div>
      {" "}
    </section>
  );
}
