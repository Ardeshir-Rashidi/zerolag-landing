import s from './Faq.module.css';

export default function Faq() {
  return (
    <section className={`sec ${s.root}`} id="faq">
      {" "}
      <div className="wrap faqv">
        {" "}
        <div>
          <h2 className="h2 rv" data-t="faqT">{"Questions & answers"}</h2>
        </div>
        {" "}
        <div className="qlist rv" data-slot="faq" data-set="home" />
        {" "}
      </div>
      {" "}
    </section>
  );
}
