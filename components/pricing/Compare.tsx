export default function Compare() {
  return (
    <section className="wrap sec">
      {" "}
      <div className="fbw">
        <div className="cmpv fb" id="cmpv">
          {" "}
          <div className="cmp-head">
            <span className="cmp-k">Compare plans</span>
            <div className="cmp-p">
              <b>Starter</b>
              <small data-pp="0">$0 / mo</small>
            </div>
            <div className="cmp-p pop">
              <b>Pro</b>
              <small data-pp="1">$5 / mo</small>
            </div>
            <div className="cmp-p">
              <b>Team</b>
              <small data-pp="2">$15 / mo</small>
            </div>
          </div>
          {" "}
          <div id="cmpBody" />
          {" "}
        </div>
      </div>
      {" "}
    </section>
  );
}
