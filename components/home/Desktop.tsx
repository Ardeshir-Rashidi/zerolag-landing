import Link from 'next/link';
import type { CSSProperties } from 'react';
import s from './Desktop.module.css';

export default function Desktop() {
  return (
    <section className={`sec ${s.root}`} id="desktop">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="dE">The desktop experience</span>
          <div>
            <h2 className="h2 rv" data-th="dT" data-split="">
              One dashboard.
              <br />
              Every connection in view.
            </h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="dP">
              A focused view of what matters: your connection, your game profile and your network status in one place.
            </p>
          </div>
        </div>
        {" "}
        <div className="wf rv">
          {" "}
          <div className="wf-l">
            {" "}
            <ol className="wf-steps" id="steps">
              {" "}
              <li className="on" style={{ "--p": "0" } as CSSProperties}>
                <button type="button" data-step="0">
                  <span className="wf-ic">
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
                    </svg>
                  </span>
                  <span className="wf-t">
                    <b data-t="wf1b">Choose your location.</b>
                    {" "}
                    <span data-t="wf1p">Recommended routes come first, and every city is one click away.</span>
                  </span>
                </button>
              </li>
              {" "}
              <li style={{ "--p": "0" } as CSSProperties}>
                <button type="button" data-step="1">
                  <span className="wf-ic">
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="6" cy="19" r="3" />
                      <circle cx="18" cy="5" r="3" />
                      <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
                    </svg>
                  </span>
                  <span className="wf-t">
                    <b data-t="wf2b">See every route.</b>
                    {" "}
                    <span data-t="wf2p">From your ISP to the game server, every hop is mapped and timed.</span>
                  </span>
                </button>
              </li>
              {" "}
              <li style={{ "--p": "0" } as CSSProperties}>
                <button type="button" data-step="2">
                  <span className="wf-ic">
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 12h4l3-7 4 14 3-7h4" />
                    </svg>
                  </span>
                  <span className="wf-t">
                    <b data-t="wf3b">Watch it live.</b>
                    {" "}
                    <span data-t="wf3p">Ping, jitter and load for every session, traced end to end.</span>
                  </span>
                </button>
              </li>
              {" "}
            </ol>
            {" "}
            <Link className="btn line" href="/download" data-t="dBtn">Get the desktop app</Link>
            {" "}
          </div>
          {" "}
          <div className="wf-r" id="panes" data-sfx="grow">
            {" "}
            <div className="pane on" data-pane="0" aria-hidden="false">
              <div className="db build" id="db" />
            </div>
            {" "}
            <div className="pane" data-pane="1" aria-hidden="true">
              <div className="tree" id="tree" />
            </div>
            {" "}
            <div className="pane" data-pane="2" aria-hidden="true">
              <div className="trace" id="trace" />
            </div>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
