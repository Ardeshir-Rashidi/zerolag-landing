import type { CSSProperties } from 'react';

export default function Launchers() {
  return (
    <section className="wrap sec" style={{ paddingBottom: "0" } as CSSProperties}>
      <div className="head">
        <span className="eyebrow" data-t="lnE">Launchers</span>
        <div>
          <h2 className="h2" data-t="lnT">Every big launcher, routed.</h2>
        </div>
      </div>
      <div className="fbw">
        <div className="mk-grid fb cg" id="plGrid" />
      </div>
    </section>
  );
}
