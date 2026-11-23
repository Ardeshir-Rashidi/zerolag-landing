import Link from 'next/link';
import type { CSSProperties } from 'react';

export default function CantDecide() {
  return (
    <section className="sec">
      <div className="wrap endcta">
        <h2 className="h2 rv" data-t="cantT">Can't decide?</h2>
        <div className="cta rv" style={{ margin: "0" } as CSSProperties}>
          <Link className="btn line" href="/contact" data-t="talkUs">Talk to us</Link>
          <button className="btn white" type="button" data-plan="" data-t="getFree">Start for free</button>
        </div>
      </div>
    </section>
  );
}
