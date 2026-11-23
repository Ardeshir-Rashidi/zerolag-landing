import Link from 'next/link';
import s from './AppsTeaser.module.css';

export default function AppsTeaser() {
  return (
    <section className={`sec ${s.root}`} id="unblock">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="uE">Sanctions bypass</span>
          <div>
            <h2 className="h2 rv" data-t="uT">The tools that block Iran. Unblocked.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="uS">
              Docker, Figma, Android Studio and the launchers you play on answer you like anyone else.
            </p>
            <Link className="btn line rv" href="/apps" data-t="exploreApps">Explore apps</Link>
          </div>
        </div>
        {" "}
        <div className="mq" id="aMq" data-sfx="drift" />
        {" "}
      </div>
      {" "}
    </section>
  );
}
