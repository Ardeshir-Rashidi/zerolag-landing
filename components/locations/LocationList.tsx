import type { CSSProperties } from 'react';

export default function LocationList() {
  return (
    <section className="wrap">
      {" "}
      <div className="head" style={{ marginBottom: "24px" } as CSSProperties}>
        <div>
          <span className="eyebrow" data-t="frE">Explore the network</span>
          <h2 className="h2" data-t="frT">Find your region.</h2>
          <p className="sub" data-t="frS">Choose a location and see its route from Tehran.</p>
        </div>
        <div className="tools head-r" style={{ margin: "0" } as CSSProperties}>
          <div className="seg" id="lRg" />
          <label className="search">
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input id="lq" type="search" autoComplete="off" data-tp="wSearch" placeholder="Search locations" />
          </label>
        </div>
      </div>
      {" "}
      <div className="fbw">
        <div className="rtable fb" id="rtable" />
      </div>
      {" "}
    </section>
  );
}
