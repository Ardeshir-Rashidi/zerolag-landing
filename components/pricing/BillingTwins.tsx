import type { CSSProperties } from 'react';

export default function BillingTwins() {
  return (
    <section className="wrap sec" style={{ paddingBottom: "0" } as CSSProperties}>
      {" "}
      <div className="fbw">
        <div className="twin fb cg">
          {" "}
          <div className="tw rv">
            <div className="tw-vz" id="twEnc" />
            <div className="tw-tx">
              <h3 data-t="tw1t">Encrypted on every plan.</h3>
              <p className="muted" data-t="tw1p">DNS over HTTPS and DNS over TLS are included from Starter up.</p>
            </div>
          </div>
          {" "}
          <div className="tw rv" style={{ "--d": ".1s" } as CSSProperties}>
            <div className="tw-vz" id="twDev" />
            <div className="tw-tx">
              <h3 data-t="tw2t">Grow by devices.</h3>
              <p className="muted" data-t="tw2p">One device on Starter, five on Pro, fifteen on Team.</p>
            </div>
          </div>
          {" "}
        </div>
      </div>
      {" "}
    </section>
  );
}
