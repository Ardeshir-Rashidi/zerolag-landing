import type { CSSProperties } from 'react';

export default function PricingFaq() {
  return (
    <section className="sec" style={{ paddingTop: "0" } as CSSProperties}>
      <div className="wrap faqv">
        <div>
          <h2 className="h2 rv" data-t="faqT">{"Questions & answers"}</h2>
        </div>
        <div className="qlist rv" data-slot="faq" data-set="pricing" />
      </div>
    </section>
  );
}
