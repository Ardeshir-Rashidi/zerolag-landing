import s from './Stats.module.css';

export default function Stats() {
  return (
    <section className={`sec ${s.root}`} id="stats">
      {" "}
      <div className="wrap">
        {" "}
        <div className="fbw">
          <div className="stats fb cg" id="statsRow" />
        </div>
        {" "}
      </div>
      {" "}
    </section>
  );
}
