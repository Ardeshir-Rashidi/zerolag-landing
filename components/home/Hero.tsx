import { assetPath } from '@/lib/paths';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import s from './Hero.module.css';

export default function Hero() {
  return (
    <section className={`hero ${s.root}`} id="top">
      {" "}
      <div className="wrap hero-head">
        {" "}
        <Link className="chip-new rv in" href="/apps">
          <span className="t" data-t="new">New</span>
          <span data-t="heroChip">Unblock 40+ games and tools that block Iran</span>
          <svg className="ic flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        {" "}
        <h1 className="h1 wd in" data-words="" data-split="en">
          <span data-t="heroA">
            <span className="w" style={{ "--i": "0" } as CSSProperties}>Lower</span>
            {" "}
            <span className="w" style={{ "--i": "1" } as CSSProperties}>ping.</span>
          </span>
          {" "}
          <span className="dim" data-t="heroB">
            <span className="w" style={{ "--i": "2" } as CSSProperties}>Play</span>
            {" "}
            <span className="w" style={{ "--i": "3" } as CSSProperties}>fast.</span>
          </span>
        </h1>
        {" "}
        <p className="lead rv in" style={{ "--d": ".15s" } as CSSProperties} data-t="heroSub">
          ZeroLag finds the shortest route to your game's servers, opens the games and tools that turn Iran away, and shows you every millisecond. One app for PC, Mac, Android and iPhone.
        </p>
        {" "}
        <div className="cta rv in" style={{ "--d": ".25s" } as CSSProperties}>
          <Link className="btn white" href="/download">
            <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            <span data-t="ctaDownload">Download the app</span>
          </Link>
          <Link className="btn line" href="/pricing" data-t="ctaFree">Start for free</Link>
        </div>
        {" "}
        <p className="fine rv in" style={{ "--d": ".3s" } as CSSProperties} data-t="heroFine">
          Free plan · No credit card
        </p>
        {" "}
      </div>
      {" "}
      <div className="wrap hero-shot" data-sfx="tilt">
        {" "}
        <div className="appwin rv on-state in" id="appwin" style={{ "--d": ".3s" } as CSSProperties}>
          {" "}
          <div className="win-bar">
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
            <span className="crumb">
              <b>ZeroLag</b>
              <span>/</span>
              <span data-t="wCrumb">Connection</span>
            </span>
            <span className="win-tag">
              <span className="logo sm" data-logo="">
                <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
                  <path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" strokeWidth="2.375" strokeLinejoin="round" stroke="url(#zs3)" />
                  <path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#zs4)" />
                  <defs>
                    <linearGradient id="zs3" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                    <linearGradient id="zs4" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span data-t="wDesktop">Desktop app</span>
            </span>
          </div>
          {" "}
          <div className="win-body">
            {" "}
            <div className="zcall" data-for="loc">
              <b data-t="zLocT">Pick a location</b>
              <p data-t="zLocP">Recommended servers first, then every country with its live ping.</p>
            </div>
            {" "}
            <div className="zcall" data-for="map">
              <b data-t="zMapT">See the route</b>
              <p data-t="zMapP">Your path from Tehran to the game server, hop by hop.</p>
            </div>
            {" "}
            <div className="zcall" data-for="stats">
              <b data-t="zStT">Stay in control</b>
              <p data-t="zStP">One button to connect, with live ping, jitter and load.</p>
            </div>
            {" "}
            <aside className="w-side" aria-hidden="true" data-zone="x">
              <span className="logo md" data-logo="">
                <svg viewBox="0 0 38 38" fill="none" aria-hidden="true">
                  <path d="M19 3.5625L32.0625 8.3125V17.8125C32.0625 26.7188 26.125 32.0625 19 34.4375C11.875 32.0625 5.9375 26.7188 5.9375 17.8125V8.3125L19 3.5625Z" strokeWidth="2.375" strokeLinejoin="round" stroke="url(#zs5)" />
                  <path d="M21.0781 8.90625L12.4688 20.7812H18.4062L16.625 29.6875L25.5312 17.2188H19.5938L21.0781 8.90625Z" fill="url(#zs6)" />
                  <defs>
                    <linearGradient id="zs5" x1="5.9375" y1="3.5625" x2="36.3866" y2="29.3272" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                    <linearGradient id="zs6" x1="12.4688" y1="8.90625" x2="31.195" y2="20.677" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" />
                      <stop offset="1" stopColor="#A1A1A1" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <svg className="ic on" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
              </svg>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" />
                <path d="M17.3 5H6.7a4 4 0 0 0-4 3.6l-.9 8.1a2.5 2.5 0 0 0 2.5 2.8c1 0 1.9-.6 2.3-1.4L8 15h8l1.4 3.1c.4.9 1.3 1.4 2.3 1.4a2.5 2.5 0 0 0 2.5-2.8l-.9-8.1a4 4 0 0 0-4-3.6z" />
              </svg>
              <svg className="ic" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="5" r="1.7" />
                <circle cx="12" cy="5" r="1.7" />
                <circle cx="19" cy="5" r="1.7" />
                <circle cx="5" cy="12" r="1.7" />
                <circle cx="12" cy="12" r="1.7" />
                <circle cx="19" cy="12" r="1.7" />
                <circle cx="5" cy="19" r="1.7" />
                <circle cx="12" cy="19" r="1.7" />
                <circle cx="19" cy="19" r="1.7" />
              </svg>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
              </svg>
              <span className="sp" />
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 7h-9M14 17H5" />
                <circle cx="17" cy="17" r="3" />
                <circle cx="7" cy="7" r="3" />
              </svg>
              <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </aside>
            {" "}
            <div className="w-locs" data-zone="loc">
              <div className="w-scroll wr" id="wlist" />
            </div>
            {" "}
            <div className="w-map" data-zone="map">
              {" "}
              <div className="map" id="globe" />
              {" "}
            </div>
            {" "}
            <div className="w-conn" data-zone="stats">
              {" "}
              <div className="wc-h">
                <span className="wc-t">
                  <i className="sk" style={{ width: "122px" } as CSSProperties} />
                  <i className="sk" style={{ width: "86px" } as CSSProperties} />
                </span>
                <button className="w-shield" type="button" id="shieldBtn2" data-ta="shieldT" aria-label={"Ad & Tracker Shield"} aria-pressed="false">
                  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
                  </svg>
                </button>
              </div>
              {" "}
              <div className="pw-wrap">
                <button className="power" id="power" type="button" aria-pressed="true" data-ta="power" aria-label="Connect or disconnect">
                  <span className="ring" />
                  <span className="ring r2" />
                  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v9" />
                    <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
                  </svg>
                </button>
                {" "}
                <p className="pw-state">
                  <i className="dot" />
                  <i className="sk" style={{ width: "104px" } as CSSProperties} />
                  <span id="pwState" className="sr-only">Protected · Click to disconnect</span>
                </p>
              </div>
              {" "}
              <div className="w-time">
                <i className="sk wc-l" />
                <b className="num" id="ctime" dir="ltr">00:24:23</b>
                {" "}
                <div className="w-stats">
                  <div>
                    <i className="sk" />
                    <b>
                      <span id="sPing" className="num">16</span>
                      <em>ms</em>
                    </b>
                  </div>
                  <div>
                    <i className="sk" />
                    <b>
                      <span id="sJit" className="num">1</span>
                      <em>ms</em>
                    </b>
                  </div>
                  <div>
                    <i className="sk" />
                    <b>
                      <span id="sLoad" className="num">52</span>
                      <em>%</em>
                    </b>
                  </div>
                </div>
                {" "}
              </div>
              {" "}
              <div className="w-cur">
                <img className="flag" id="curFlag" src={assetPath('/img/f/QA.webp')} alt="" />
                <span className="grow">
                  <i className="sk" style={{ width: "64%" } as CSSProperties} />
                  <i className="sk s2" style={{ width: "42%" } as CSSProperties} />
                </span>
                <span className="wc-ch">
                  <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              {" "}
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div className="wrap hero-tabs rv" role="tablist" aria-label="Highlights">
        {" "}
        <button type="button" role="tab" aria-selected="false" data-focus="loc">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
          </svg>
          <span data-t="tabLoc">Pick a location</span>
        </button>
        {" "}
        <button type="button" role="tab" aria-selected="false" data-focus="map">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="6" cy="19" r="3" />
            <circle cx="18" cy="5" r="3" />
            <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
          </svg>
          <span data-t="tabMap">See the route</span>
        </button>
        {" "}
        <button type="button" role="tab" aria-selected="false" data-focus="stats">
          <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v9" />
            <path d="M18.4 6.6a9 9 0 1 1-12.8 0" />
          </svg>
          <span data-t="tabStats">Live connection stats</span>
        </button>
        {" "}
      </div>
      {" "}
    </section>
  );
}
