import { assetPath } from '@/lib/paths';
import s from './Routing.module.css';

export default function Routing() {
  return (
    <section className={`sec ${s.root}`} id="routing">
      {" "}
      <div className="wrap">
        {" "}
        <div className="head">
          <span className="eyebrow rv" data-t="rtE">Smart routing</span>
          <div>
            <h2 className="h2 rv" data-t="c1b">Closer to every server.</h2>
          </div>
          <div className="head-r">
            <p className="lead rv" data-t="c1p">
              ZeroLag pings every route and takes the shortest path to your game, on its own.
            </p>
          </div>
        </div>
        {" "}
        <div className="fbw">
          <div className="rpanel fb" data-sfx="grow">
            {" "}
            <div className="rp">
              {" "}
              <div className="rp-pick" id="bPick" role="tablist" />
              {" "}
              <div className="rp-h">
                <img className="flag" id="bFlag" src={assetPath('/img/f/DE.webp')} alt="" />
                <div>
                  <b id="bCity">Frankfurt</b>
                  <small id="bCo">Germany</small>
                </div>
                <span className="rp-st off" id="bSt" />
              </div>
              {" "}
              <div className="rp-l" id="bRows" />
              {" "}
              <div className="rp-sum" id="bSum" />
              {" "}
            </div>
            {" "}
            <div className="rp-map">
              <div className="map" id="bMap" />
              <span className="chip2 rp-f">
                <span>ROUTE</span>
                <span id="bRoute">tehran → frankfurt · 24 ms</span>
              </span>
            </div>
            {" "}
          </div>
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
