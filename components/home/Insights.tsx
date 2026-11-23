import type { CSSProperties } from 'react';
import s from './Insights.module.css';

export default function Insights() {
  return (
    <section className={`sec ${s.root}`} id="insights">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="anE">Live insights</span>
          <div>
            <h2 className="h2 rv" id="chartT">Same match, 59 ms faster.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="anS">
              Ping to a VALORANT server over 60 seconds, with and without ZeroLag. Sample data.
            </p>
            <div className="legend rv">
              <span>
                <i className="sw" style={{ background: "var(--blue2)" } as CSSProperties} />
                <span data-t="lgZ">With ZeroLag</span>
              </span>
              <span>
                <i className="sw" style={{ background: "var(--teal)" } as CSSProperties} />
                <span data-t="lgJ">Jitter</span>
              </span>
              <span>
                <i className="sw" style={{ background: "#555" } as CSSProperties} />
                <span data-t="lgI">Your ISP</span>
              </span>
            </div>
          </div>
        </div>
        {" "}
        <div className="fig" id="lineFig" data-sfx="grow">
          <svg id="lineSvg" viewBox="0 0 1176 420" />
          <div className="tip" id="lineTip" hidden />
          <span className="chip2" style={{ left: "1026px", top: "14.8889px" } as CSSProperties}>
            <span>MAX</span>
            <span>170 ms</span>
          </span>
          <span className="chip2" style={{ left: "174.933px", top: "148.933px" } as CSSProperties}>
            <span>WHERE</span>
            <span>isp='direct'</span>
          </span>
          <span className="chip2" style={{ left: "436.8px", top: "328.178px" } as CSSProperties}>
            <span>AVG</span>
            <span>42 ms</span>
          </span>
          <span className="chip2" style={{ left: "698.667px", top: "331.564px" } as CSSProperties}>
            <span>GROUP BY</span>
            <span>route</span>
          </span>
          <div className="end-pill" style={{ top: "242.089px" } as CSSProperties}>
            <span>With ZeroLag</span>
            <b>44 ms</b>
            <span className="pct blue">−74%</span>
          </div>
          <div className="end-pill" style={{ top: "335.236px" } as CSSProperties}>
            <span>Jitter</span>
            <b>2.2 ms</b>
            <span className="pct teal">±0.4</span>
          </div>
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
