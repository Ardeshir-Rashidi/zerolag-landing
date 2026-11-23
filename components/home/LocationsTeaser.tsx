import Link from 'next/link';
import s from './LocationsTeaser.module.css';

export default function LocationsTeaser() {
  return (
    <section className={`sec ${s.root}`} id="h-locations">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="lE">A global perspective</span>
          <div>
            <h2 className="h2 rv" data-t="lT">A network without the distance.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="lS">Explore every region and choose a route close to your game.</p>
            <Link className="btn line rv" href="/locations" data-t="exploreLoc">Explore locations</Link>
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="netmap fb" data-sfx="globe">
            <div className="map" id="netMap" />
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="codes rv fb cg" id="codes" />
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
