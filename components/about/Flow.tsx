import type { CSSProperties } from 'react';

export default function Flow() {
  return (
    <section className="wrap">
      <div className="flow rv" id="flow">
        <svg />
        {" "}
        <div className="fbox l">
          <b data-t="fYou">Your game</b>
          <code>euw.valorant</code>
        </div>
        {" "}
        <span className="flbl" style={{ left: "28%" } as CSSProperties} data-t="fQuery">QUERY</span>
        {" "}
        <div className="fbox c">
          <span className="logo" data-logo="">
            <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
              <path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" strokeWidth="2.375" strokeLinejoin="round" stroke="url(#zs9)" />
              <path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#zs10)" />
              <defs>
                <linearGradient id="zs9" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#A1A1A1" />
                </linearGradient>
                <linearGradient id="zs10" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#A1A1A1" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <b>ZeroLag</b>
        </div>
        {" "}
        <span className="flbl" style={{ left: "72%" } as CSSProperties} data-t="fRouted">ROUTED</span>
        {" "}
        <div className="fbox r">
          <b data-t="fServer">Game server</b>
          <code>185.51.201.11</code>
        </div>
        {" "}
      </div>
    </section>
  );
}
