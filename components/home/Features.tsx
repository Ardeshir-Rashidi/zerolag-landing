import { assetPath } from '@/lib/paths';
import type { CSSProperties } from 'react';
import s from './Features.module.css';

export default function Features() {
  return (
    <section className={`sec ${s.root}`} id="features">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="bentoE">The network behind every match</span>
          <div>
            <h2 className="h2 rv" data-t="bentoT">One app. Every layer of your connection.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="bentoS">From the first lookup to the last packet, every millisecond counts.</p>
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="cells rv fb cg">
            {" "}
            <article className="cell span2">
              <span className="k">01</span>
              <div className="vz">
                <div className="term" id="unblockTerm">
                  <div className="bar">
                    <span className="tag blue">via ZeroLag · DNS</span>
                    <span className="mono" style={{ fontSize: "11px" } as CSSProperties}>GET</span>
                  </div>
                  <div className="foot" />
                </div>
              </div>
              <p className="cap">
                <b data-t="c2b">Blocked in Iran? Not anymore.</b>
                {" "}
                <span data-t="c2p">Games, launchers and tools that refuse Iranian IPs open like anywhere else.</span>
              </p>
            </article>
            {" "}
            <article className="cell" id="cPerf">
              <span className="k">02</span>
              <div className="vz">
                <div className="perf">
                  <b className="big num" id="perfN">14</b>
                  <span className="unit">ms</span>
                  <svg className="spark" id="spark" preserveAspectRatio="none" viewBox="0 0 185 70">
                    <path d="M0.0 50.0L6.4 40.0L12.8 45.0L19.1 50.0L25.5 35.0L31.9 40.0L38.3 40.0L44.7 40.0L51.0 40.0L57.4 45.0L63.8 45.0L70.2 35.0L76.6 45.0L82.9 40.0L89.3 40.0L95.7 35.0L102.1 40.0L108.4 50.0L114.8 45.0L121.2 35.0L127.6 40.0L134.0 40.0L140.3 40.0L146.7 45.0L153.1 45.0L159.5 35.0L165.9 50.0L172.2 45.0L178.6 40.0L185.0 35.0" fill="none" stroke="#ededed" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="185" cy="35" r="3" fill="#3291ff" />
                  </svg>
                </div>
              </div>
              <p className="cap">
                <b data-t="c3b">Know your connection.</b>
                {" "}
                <span data-t="c3p">A live ping to your route, refreshed every second.</span>
              </p>
            </article>
            {" "}
            <article className="cell" id="cBars">
              <span className="k">03</span>
              <div className="vz">
                <div className="vz-stack">
                  <div className="bars" id="bars" />
                  <div className="bars-f">
                    <span className="pill">
                      <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span data-t="c4pill">Stable under load</span>
                    </span>
                  </div>
                </div>
              </div>
              <p className="cap">
                <b data-t="c4b">Ping. Jitter. Load.</b>
                {" "}
                <span data-t="c4p">24 hours of your connection, without the noise.</span>
              </p>
            </article>
            {" "}
            <article className="cell">
              <span className="k">04</span>
              <div className="vz">
                <div className="pwin">
                  <div className="hd">
                    <i />
                    <i />
                    <i />
                    <span style={{ marginInlineStart: "6px" } as CSSProperties}>profile.zl</span>
                  </div>
                  <div className="bd">
                    <img alt="" id="profImg" src={assetPath('/img/g/val.webp')} width="44" height="66" />
                    <div id="profT" />
                  </div>
                </div>
              </div>
              <p className="cap">
                <b data-t="c5b">Profiles made for play.</b>
                {" "}
                <span data-t="c5p">Your game, its best route and your platform, ready in one tap.</span>
              </p>
            </article>
            {" "}
            <article className="cell">
              <span className="k">05</span>
              <div className="vz">
                <div className="shieldvz">
                  <div className="src">
                    <span>
                      <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01" />
                        <path d="M17.3 5H6.7a4 4 0 0 0-4 3.6l-.9 8.1a2.5 2.5 0 0 0 2.5 2.8c1 0 1.9-.6 2.3-1.4L8 15h8l1.4 3.1c.4.9 1.3 1.4 2.3 1.4a2.5 2.5 0 0 0 2.5-2.8l-.9-8.1a4 4 0 0 0-4-3.6z" />
                      </svg>
                    </span>
                    <span>
                      <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </span>
                  </div>
                  <div className="lines">
                    <i className="ok" />
                    <i className="no" />
                  </div>
                  <div className="panel" id="shieldOpts" />
                </div>
              </div>
              <p className="cap">
                <b data-t="c6b">More control. Less noise.</b>
                {" "}
                <span data-t="c6p">Game traffic goes through. Ads, trackers and malware don't.</span>
              </p>
            </article>
            {" "}
            <article className="cell c-dns" id="cDns">
              <span className="k">06</span>
              <div className="vz">
                <div className="ba">
                  <div className="ba-b">
                    <small data-t="baBefore">Before</small>
                    <div className="ba-chips">
                      <span>ISP DNS</span>
                      <span>UDP 53</span>
                      <span>plain text</span>
                      <span>logged</span>
                      <span>rewritten</span>
                    </div>
                  </div>
                  <div className="ba-a">
                    <small data-t="baAfter">After</small>
                    <div className="ba-box">
                      <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                      <span>ZeroLag DNS</span>
                      <span className="tag blue">DoH · DoT</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="cap">
                <b data-t="c8b">Private by default.</b>
                {" "}
                <span data-t="c8p">Every lookup is encrypted with DoH or DoT, so your ISP can't read or rewrite it.</span>
              </p>
            </article>
            {" "}
            <article className="cell span2">
              <span className="k">07</span>
              <div className="vz" style={{ alignContent: "start" } as CSSProperties}>
                <div className="test-top">
                  <button className="btn line xs" id="testBtn" type="button">
                    <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-2.6-6.4L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                    <span data-t="runAgain">Run again</span>
                  </button>
                </div>
                <div className="race" id="race" />
              </div>
              <p className="cap">
                <b data-t="c7b">We ping every city. You get the fastest.</b>
                {" "}
                <span data-t="c7p">One tap measures every location from where you are, then connects you to the winner.</span>
              </p>
            </article>
            {" "}
          </div>
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
