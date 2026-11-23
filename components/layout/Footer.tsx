import Link from 'next/link';
import s from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={`vfoot ${s.root}`}>
      {" "}
      <div className="wrap">
        {" "}
        <div className="vf-grid">
          {" "}
          <div className="vf-brand">
            <Link className="brand" href="/" data-go="home">
              <span className="logo" data-logo="">
                <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
                  <path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" strokeWidth="2.375" strokeLinejoin="round" stroke="url(#zs11)" />
                  <path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#zs12)" />
                  <defs>
                    <linearGradient id="zs11" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                    <linearGradient id="zs12" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span>ZeroLag</span>
            </Link>
            <p className="muted" data-t="footTag">A better connection starts with the route.</p>
          </div>
          {" "}
          <div>
            <h4 data-t="fcProduct">Product</h4>
            <Link href="/games" data-t="nGames">Games</Link>
            <Link href="/apps" data-t="nApps">Apps</Link>
            <Link href="/locations" data-t="nLocations">Locations</Link>
            <Link href="/pricing" data-t="nPricing">Pricing</Link>
          </div>
          {" "}
          <div>
            <h4 data-t="fcDl">Download</h4>
            <Link href="/download?os=win" data-pick="win">Windows</Link>
            <Link href="/download?os=mac" data-pick="mac">macOS</Link>
            <Link href="/download?os=and" data-pick="and">Android</Link>
            <Link href="/download?os=ios" data-pick="ios">iOS</Link>
          </div>
          {" "}
          <div>
            <h4 data-t="fcCo">Company</h4>
            <Link href="/about" data-t="nAbout">About</Link>
            <Link href="/contact" data-t="nContact">Contact</Link>
            <Link href="/pricing" data-t="faqShort">FAQ</Link>
          </div>
          {" "}
        </div>
        {" "}
        <div className="vf-bot">
          <span className="status">
            <i className="dot blue" />
            <span data-t="status">All systems normal.</span>
          </span>
          <span className="muted">© 2026 ZeroLag</span>
        </div>
        {" "}
      </div>
      {" "}
    </footer>
  );
}
