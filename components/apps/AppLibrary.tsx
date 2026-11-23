import type { CSSProperties } from 'react';

export default function AppLibrary() {
  return (
    <section className="wrap">
      {" "}
      <div className="head">
        <div>
          <span className="eyebrow" data-t="aLibE">App library</span>
          <h2 className="h2" data-t="aLibT">Find your tool.</h2>
          <p className="sub" data-t="aLibS">Filter by category or search by name.</p>
        </div>
        <div className="tools head-r" style={{ margin: "0" } as CSSProperties}>
          <div className="seg" id="appCats" />
          <label className="search">
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input id="aq" type="search" autoComplete="off" data-tp="aSearch" placeholder="Search apps…" />
          </label>
        </div>
      </div>
      {" "}
      <div className="fbw">
        <div className="mk-grid fb cg" id="appGrid" />
      </div>
      {" "}
    </section>
  );
}
