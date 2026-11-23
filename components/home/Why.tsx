import Link from 'next/link';
import type { CSSProperties } from 'react';
import s from './Why.module.css';

export default function Why() {
  return (
    <section className={`sec vs ${s.root}`} id="why">
      {" "}
      <div className="wrap">
        {" "}
        <div className="fbw">
          <div className="std rv fb">
            <span className="mono" data-t="stdT">Open standards. Zero compromise.</span>
            <div className="std-chips">
              <span>DNS over HTTPS</span>
              <span>DNS over TLS</span>
              <span>DNSSEC</span>
              <span>IPv6</span>
            </div>
          </div>
        </div>
        {" "}
        <span className="eyebrow rv" data-t="whyE">Why ZeroLag</span>
        {" "}
        <div className="why">
          {" "}
          <h2 className="h2 rv" data-th="whyT" data-split="">
            Every match starts
            <br />
            with a route.
          </h2>
          {" "}
          <div className="rv" style={{ "--d": ".1s" } as CSSProperties}>
            <p className="lead" data-t="whyP">
              Your ISP sends game traffic the long way round, and many publishers block Iran outright. ZeroLag fixes both: a private route to the server, and access to the games and tools that turned you away.
            </p>
            <Link className="btn line" href="/about" data-t="aboutBtn">About ZeroLag</Link>
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
