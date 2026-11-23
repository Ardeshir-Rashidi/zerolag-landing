import Link from 'next/link';
import s from './Nav.module.css';

import MenuToggle from './MenuToggle';

export default function Nav() {
  return (
    <header className={`nav ${s.root}`} id="nav">
      {" "}
      <div className="nav-in">
        {" "}
        <Link className="brand" href="/" data-go="home" aria-label="ZeroLag home">
          <span className="logo" data-logo="">
            <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
              <path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" strokeWidth="2.375" strokeLinejoin="round" stroke="url(#zs1)" />
              <path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#zs2)" />
              <defs>
                <linearGradient id="zs1" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#A1A1A1" />
                </linearGradient>
                <linearGradient id="zs2" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="#A1A1A1" />
                </linearGradient>
              </defs>
            </svg>
          </span>
          <span>ZeroLag</span>
        </Link>
        {" "}
        <nav className="links" aria-label="Main">
          {" "}
          <Link href="/games" data-t="nGames">Games</Link>
          {" "}
          <Link href="/apps" data-t="nApps">Apps</Link>
          {" "}
          <Link href="/locations" data-t="nLocations">Locations</Link>
          {" "}
          <Link href="/pricing" data-t="nPricing">Pricing</Link>
          {" "}
          <Link href="/about" data-t="nAbout">About</Link>
          {" "}
          <Link href="/contact" data-t="nContact">Contact</Link>
          {" "}
        </nav>
        {" "}
        <div className="nav-r">
          {" "}
          <Link className="btn ghost hide-s" href="/pricing" data-t="login">Log in</Link>
          {" "}
          <Link className="btn dark sm" href="/download">
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            <span data-t="download">Download</span>
          </Link>
          {" "}
          <button className="menu-btn" type="button" aria-expanded="false" aria-controls="sheet" data-ta="menu" aria-label="Menu">
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div className={`sheet ${s.root}`} id="sheet" hidden>
        {" "}
        <nav className="sheet-l">
          <Link href="/games" data-t="nGames">Games</Link>
          <Link href="/apps" data-t="nApps">Apps</Link>
          <Link href="/locations" data-t="nLocations">Locations</Link>
          <Link href="/pricing" data-t="nPricing">Pricing</Link>
          <Link href="/about" data-t="nAbout">About</Link>
          <Link href="/contact" data-t="nContact">Contact</Link>
        </nav>
        {" "}
        <div className="sheet-b">
          <Link href="/download" className="btn white" data-t="download">Download</Link>
          <Link href="/pricing" className="btn line" data-t="login">Log in</Link>
        </div>
        {" "}
      </div>
      {" "}
      <MenuToggle />
    </header>
  );
}
