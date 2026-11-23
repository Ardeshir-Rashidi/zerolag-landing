import type { CSSProperties } from 'react';
import s from './Devices.module.css';

export default function Devices() {
  return (
    <section className={`sec ${s.root}`} id="everywhere">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="dlE">Every screen you play on</span>
          <div>
            <h2 className="h2 rv" data-t="dlT">One account. Every device.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="dlS">
              Apps for Windows, macOS, Android and iPhone. Consoles and routers use ZeroLag DNS with a short guide.
            </p>
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="rings fb" id="rings" data-sfx="grow">
            <svg />
            <div className="core">
              <span className="logo" data-logo="">
                <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
                  <path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" strokeWidth="2.375" strokeLinejoin="round" stroke="url(#zs7)" />
                  <path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#zs8)" />
                  <defs>
                    <linearGradient id="zs7" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                    <linearGradient id="zs8" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </div>
            <span className="nd" data-i="0" style={{ left: "657.622px", top: "116.634px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 5.6 10.4 4.6v7H3zM11.4 4.4 21 3v8.6h-9.6zM3 12.4h7.4v7L3 18.4zM11.4 12.4H21V21l-9.6-1.4z" />
              </svg>
              <span>Windows</span>
            </span>
            <span className="nd" data-i="1" style={{ left: "521.411px", top: "34.581px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.21 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09zm3.38-3.07c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.8-3.53 1.82-.78.9-1.46 2.34-1.27 3.71 1.34.1 2.71-.69 3.55-1.7" />
              </svg>
              <span>macOS</span>
            </span>
            <span className="nd" data-i="2" style={{ left: "780.869px", top: "354.985px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 18c0 .55.45 1 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h2v3.5a1.5 1.5 0 0 0 3 0V19h1c.55 0 1-.45 1-1V8H6zM3.5 8A1.5 1.5 0 0 0 2 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 3.5 8zm17 0A1.5 1.5 0 0 0 19 9.5v7a1.5 1.5 0 0 0 3 0v-7A1.5 1.5 0 0 0 20.5 8zm-4.97-5.84 1.3-1.3a.5.5 0 0 0-.7-.7l-1.48 1.48A6 6 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15a.5.5 0 0 0-.7.7l1.31 1.31A6 6 0 0 0 6 7h12a6 6 0 0 0-2.47-4.84zM10 5H9V4h1zm5 0h-1V4h1z" />
              </svg>
              <span>Android</span>
            </span>
            <span className="nd" data-i="3" style={{ left: "582.378px", top: "323.366px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="7" y="2" width="10" height="20" rx="2.5" />
                <path d="M11 18h2" />
              </svg>
              <span>iPhone</span>
            </span>
            <span className="nd" data-i="4" style={{ left: "912.335px", top: "89.8443px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="5" />
                <path d="M6 12h4M8 10v4M15 13h.01M18 11h.01" />
              </svg>
              <span>PlayStation 5</span>
            </span>
            <span className="nd" data-i="5" style={{ left: "327.665px", top: "89.8443px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="5" />
                <path d="M6 12h4M8 10v4M15 13h.01M18 11h.01" />
              </svg>
              <span>Xbox</span>
            </span>
            <span className="nd" data-i="6" style={{ left: "1038.46px", top: "355.967px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="5" />
                <path d="M6 12h4M8 10v4M15 13h.01M18 11h.01" />
              </svg>
              <span>Nintendo Switch</span>
            </span>
            <span className="nd" data-i="7" style={{ left: "201.535px", top: "355.967px" } as CSSProperties}>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="13" width="20" height="8" rx="2" />
                <path d="M6 17h.01M10 17h.01M15 13V9M12.5 6.5a4 4 0 0 1 5 0M10 4a7.5 7.5 0 0 1 10 0" />
              </svg>
              <span>Router</span>
            </span>
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="dl4 fb cg" id="dl4" />
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
