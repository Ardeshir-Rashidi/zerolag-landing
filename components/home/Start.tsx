import Link from 'next/link';
import type { CSSProperties } from 'react';

export default function Start() {
  return (
    <section className="sec" id="start">
      {" "}
      <div className="wrap endcta">
        {" "}
        <h2 className="h2 rv" data-th="endT" data-split="">
          Your next match
          <br />
          starts here.
        </h2>
        {" "}
        <div className="cta rv" style={{ margin: "0" } as CSSProperties}>
          <Link className="btn line" href="/pricing" data-t="seePlans">See plans</Link>
          <Link className="btn white" href="/download" data-t="ctaDownload">Download the app</Link>
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
