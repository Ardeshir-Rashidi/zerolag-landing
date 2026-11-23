import type { CSSProperties } from 'react';

export default function GameLibrary() {
  return (
    <section className="wrap">
      {" "}
      <div className="head">
        <div>
          <span className="eyebrow" data-t="gLibE">Game library</span>
          <h2 className="h2" data-t="gLibT">Find your game.</h2>
          <p className="sub" data-t="gLibS">Filter by platform or search by name.</p>
        </div>
        <div className="tools head-r" style={{ margin: "0" } as CSSProperties}>
          <div className="seg" id="gPlat" />
          <label className="search">
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input id="gq" type="search" autoComplete="off" data-tp="gSearch" placeholder="Search games…" />
          </label>
        </div>
      </div>
      {" "}
      <div className="fbw">
        <div className="mk-grid fb cg" id="gGrid" />
      </div>
      {" "}
      <div className="more">
        <button className="btn line" id="gMore" type="button">Show all 41 games</button>
      </div>
      {" "}
      <p className="note" data-t="gNote">
        Ping figures are sample values from the ZeroLag app prototype, measured from Tehran.
      </p>
      {" "}
    </section>
  );
}
