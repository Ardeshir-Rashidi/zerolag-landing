import Link from 'next/link';

export default function PricingTeaser() {
  return (
    <section className="sec" id="h-pricing">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="prE">Simple plans</span>
          <div>
            <h2 className="h2 rv" data-t="prT">Choose your next connection.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="prS">Start small. Find the right plan for your devices.</p>
            <Link className="btn line rv" href="/pricing" data-t="compareAll">Compare all plans</Link>
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="rv fb" data-slot="plans" />
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
