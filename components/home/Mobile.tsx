import s from './Mobile.module.css';

export default function Mobile() {
  return (
    <section className={`sec ${s.root}`} id="mobile">
      <div className="wrap" data-slot="mobile" />
    </section>
  );
}
